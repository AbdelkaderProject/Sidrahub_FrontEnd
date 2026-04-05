import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { TableActionsComponent } from '../table-actions/table-actions.component';
import { TableShellComponent } from '../table-shell/table-shell.component';

@Component({
  selector: 'app-crud-shell',
  standalone: true,
  imports: [CommonModule, TableShellComponent, TableActionsComponent],
  templateUrl: './crud-shell.component.html',
  styleUrls: ['./crud-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudShellComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = 'pi pi-database';
  @Input() tableTitle = 'Records';
  @Input() tableIcon = 'pi pi-table';
  @Input() createLabel = 'Add New';
  @Input() showCreateButton = true;
  @Input() loading = false;
  @Input() hasData = true;
  @Input() loadingText = 'Loading data...';
  @Input() emptyTitle = 'No records found';
  @Input() emptyMessage = 'Create your first record to start managing this section.';

  @Output() create = new EventEmitter<void>();
}
