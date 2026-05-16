import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ErrorQueueService, QueuedError } from './error-queue.service';
import { TAIGA_CONFIG } from './taiga-config';

function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  const match = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/(\S+)/);
  if (match) return `${match[1]} ${match[2]}`;
  return ua.substring(0, 60);
}

function getScreenInfo(): string {
  return `${window.screen.width}x${window.screen.height}`;
}

@Injectable({
  providedIn: 'root',
})
export class TaigaService {
  private http = inject(HttpClient);
  private errorQueue = inject(ErrorQueueService);

  private isReporting = false;

  private getAssignee(errorType: string): number {
    if (['HTTP-500', 'HTTP-0', 'COMPILE'].includes(errorType)) {
      return TAIGA_CONFIG.aliceId;
    }
    return TAIGA_CONFIG.bobId;
  }

  private getPriority(errorType: string): number {
    if (['COMPILE', 'HTTP-500', 'HTTP-0'].includes(errorType)) {
      return TAIGA_CONFIG.priorityHigh;
    }
    return TAIGA_CONFIG.priorityNormal;
  }

  private formatError(error: Partial<QueuedError>): {
    project: number;
    subject: string;
    description: string;
    priority: number;
    status: number;
    type: number;
    assigned_to: number;
    tags: string[];
  } {
    const prefixMap: Record<string, string> = {
      COMPILE: '[COMPILE]',
      'HTTP-500': '[500]',
      'HTTP-0': '[NETWORK]',
      'HTTP-400': '[400]',
      'HTTP-403': '[403]',
      'HTTP-404': '[404]',
      'HTTP-409': '[409]',
      RUNTIME: '[RUNTIME]',
    };

    const date = new Date().toISOString().split('T')[0];
    const errorType = error.type || 'RUNTIME';
    const prefix = prefixMap[errorType] || '[ERROR]';

    let shortMsg = (error.message || 'Error').replace(/\n/g, ' ').substring(0, 60);
    const subject = `${prefix} ${shortMsg} - ${date}`;

    const lines: string[] = [];
    lines.push(`## ${prefix} ${error.message || 'Error desconocido'}`);
    lines.push(``);
    lines.push(`### System Context`);
    lines.push(`| Field | Value |`);
    lines.push(`|-------|-------|`);
    lines.push(`| **Timestamp** | ${error.timestamp || new Date().toISOString()} |`);
    lines.push(`| **Type** | ${errorType} |`);
    lines.push(`| **Browser** | ${getBrowserInfo()} |`);
    lines.push(`| **Screen** | ${getScreenInfo()} |`);
    lines.push(`| **URL** | ${error.url || window.location.href} |`);
    if (error.method) lines.push(`| **Method** | ${error.method} |`);
    if (error.source) lines.push(`| **Source** | \`${error.source}\` |`);

    if (error.status) {
      const statusLabels: Record<number, string> = {
        400: 'Bad Request',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        500: 'Internal Server Error',
        0: 'Network Error',
      };
      lines.push(`| **HTTP Status** | ${error.status} - ${statusLabels[error.status] || 'Unknown'} |`);
    }

    lines.push(``);
    lines.push(`### Error Details`);
    lines.push(`**Message:** ${error.message}`);
    if (error.source) lines.push(`**Source:** \`${error.source}\``);
    if (error.stack) lines.push(``, `**Stack Trace:**`, `\`\`\``, error.stack.substring(0, 1500), `\`\`\``);

    return {
      project: TAIGA_CONFIG.projectId,
      subject,
      description: lines.join('\n'),
      priority: this.getPriority(errorType),
      status: TAIGA_CONFIG.issueStatusNew,
      type: TAIGA_CONFIG.issueTypeBug,
      assigned_to: this.getAssignee(errorType),
      tags: ['automatic', 'error-reporting', errorType.toLowerCase()],
    };
  }

  async reportError(error: Partial<QueuedError>): Promise<void> {
    if (this.isReporting) return;
    this.isReporting = true;

    try {
      const body = this.formatError(error);
      await lastValueFrom(
        this.http.post(`${TAIGA_CONFIG.apiUrl}/issues`, body, {
          headers: { Authorization: `Bearer ${TAIGA_CONFIG.authToken}` },
        }),
      );
    } catch {
      this.errorQueue.enqueue(error);
    } finally {
      this.isReporting = false;
    }
  }

  async flushQueue(): Promise<void> {
    const unreported = this.errorQueue.getUnreportedErrors();
    const reportedIds: string[] = [];

    for (const error of unreported) {
      try {
        const body = this.formatError(error);
        await lastValueFrom(
          this.http.post(`${TAIGA_CONFIG.apiUrl}/issues`, body, {
            headers: { Authorization: `Bearer ${TAIGA_CONFIG.authToken}` },
          }),
        );
        reportedIds.push(error.id);
      } catch {
        break;
      }
    }

    if (reportedIds.length > 0) {
      this.errorQueue.markAsReported(reportedIds);
    }
  }

  async reportBuildError(buildOutput: string): Promise<void> {
    await this.reportError({
      type: 'COMPILE',
      message: buildOutput.substring(0, 200),
      timestamp: new Date().toISOString(),
    });
  }
}