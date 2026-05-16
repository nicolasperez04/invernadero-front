import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventType } from '../../../core/services/event-type';

import { SigmaBtnComponent } from '../sigma-btn/sigma-btn';

@Component({
  selector: 'app-crop-event-types-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, SigmaBtnComponent],
  templateUrl: './crop-event-types-dialog.html',
  styleUrl: './crop-event-types-dialog.css',
})
export class CropEventTypesDialogComponent implements OnInit {
  @Input() cropId: number = 0;
  @Input() cropName: string = '';
  @Input() allEventTypes: EventType[] = [];
  @Input() assignedEventTypeIds: Set<number> = new Set();

  @Output() close = new EventEmitter<Set<number> | null>();

  selectedIds: Set<number> = new Set();
  originalIds: Set<number> = new Set();

  ngOnInit(): void {
    this.selectedIds = new Set(this.assignedEventTypeIds);
    this.originalIds = new Set(this.assignedEventTypeIds);
  }

  get hasChanges(): boolean {
    if (this.selectedIds.size !== this.originalIds.size) return true;
    for (const id of this.selectedIds) {
      if (!this.originalIds.has(id)) return true;
    }
    return false;
  }

  toggleType(id: number): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  onCancel(): void {
    this.close.emit(null);
  }

  onSave(): void {
    this.close.emit(this.selectedIds);
  }
}
