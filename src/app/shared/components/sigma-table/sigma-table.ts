import { Component, Input, ContentChildren, QueryList, AfterContentInit, TemplateRef, ChangeDetectionStrategy, Directive } from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet, CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SigmaEmptyStateComponent } from '../sigma-empty-state/sigma-empty-state';

export interface SigmaColumn {
  key: string;
  labelKey: string;
  class?: string;
  width?: string;
}

@Directive({
  selector: 'ng-template[sigmaCell]',
  standalone: true,
})
export class SigmaCellDirective {
  @Input('sigmaCell') columnKey!: string;
  constructor(public template: TemplateRef<any>) {}
}

@Component({
  selector: 'sigma-table',
  standalone: true,
  imports: [NgFor, NgIf, NgTemplateOutlet, CommonModule, TranslateModule, SigmaEmptyStateComponent],
  templateUrl: './sigma-table.html',
  styleUrl: './sigma-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigmaTableComponent implements AfterContentInit {
  @Input() columns: SigmaColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() emptyMessage = '';
  @Input() emptyIcon = 'inbox';
  @Input() skeletonRows = 5;
  @Input() rowClass: (row: any, index: number) => string | undefined = () => undefined;

  @ContentChildren(SigmaCellDirective) cellDefs!: QueryList<SigmaCellDirective>;

  cellTemplateMap = new Map<string, TemplateRef<any>>();

  ngAfterContentInit(): void {
    this.buildTemplateMap();
    this.cellDefs.changes.subscribe(() => this.buildTemplateMap());
  }

  private buildTemplateMap(): void {
    this.cellTemplateMap.clear();
    this.cellDefs.forEach(def => this.cellTemplateMap.set(def.columnKey, def.template));
  }

  getCellTemplate(key: string): TemplateRef<any> | undefined {
    return this.cellTemplateMap.get(key);
  }

  getRowValue(row: any, key: string): string {
    const v = row[key];
    return v ?? '—';
  }

  skeletonArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
