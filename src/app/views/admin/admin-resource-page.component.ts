import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CrudShellComponent } from '../../shared/crud-shell';
import { DialogShellComponent } from '../../shared/dialog-shell/dialog-shell.component';
import { AdminResourceApiService } from './admin-resource-api.service';
import { getAdminResourceConfig } from './admin-resource.config';
import { AdminResourceConfig, AdminResourceFieldConfig, AdminSelectOption } from './admin-resource.models';

@Component({
  selector: 'app-admin-resource-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, RouterLink, CrudShellComponent, DialogShellComponent],
  templateUrl: './admin-resource-page.component.html',
  styleUrls: ['./admin-resource-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminResourcePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminResourceApiService);

  protected readonly config = signal<AdminResourceConfig | null>(null);
  protected readonly items = signal<Record<string, unknown>[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchTerm = signal('');
  protected readonly dialogVisible = signal(false);
  protected readonly deleteDialogVisible = signal(false);
  protected readonly saving = signal(false);
  protected readonly currentId = signal<number | null>(null);
  protected readonly selectedItemLabel = signal('');
  protected readonly optionMap = signal<Record<string, AdminSelectOption[]>>({});
  protected readonly relationLookup = signal<Record<string, Record<string, string>>>({});

  protected readonly filteredItems = computed(() => {
    const config = this.config();
    const term = this.searchTerm().trim().toLowerCase();
    const items = this.items();

    if (!config || !term) {
      return items;
    }

    return items.filter((item) => config.searchKeys.some((key) => String(item[key] ?? '').toLowerCase().includes(term)));
  });

  protected readonly form = new FormGroup<Record<string, FormControl>>({});

  async ngOnInit(): Promise<void> {
    const resourceKey = this.route.snapshot.data['resourceKey'] as string;
    const resourceConfig = getAdminResourceConfig(resourceKey);

    if (!resourceConfig) {
      this.loading.set(false);
      return;
    }

    this.config.set(resourceConfig);
    this.buildForm(resourceConfig);
    await this.loadOptions(resourceConfig);
    await this.refresh();
  }

  protected onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  protected openCreateDialog(): void {
    this.currentId.set(null);
    this.selectedItemLabel.set('');
    this.form.reset(this.createEmptyFormValue());
    this.dialogVisible.set(true);
  }

  protected openEditDialog(item: Record<string, unknown>): void {
    this.currentId.set(Number(item['id']));
    this.selectedItemLabel.set(this.getPrimaryLabel(item));
    this.form.reset(this.mapItemToFormValue(item));
    this.dialogVisible.set(true);
  }

  protected openDeleteDialog(item: Record<string, unknown>): void {
    this.currentId.set(Number(item['id']));
    this.selectedItemLabel.set(this.getPrimaryLabel(item));
    this.deleteDialogVisible.set(true);
  }

  protected closeFormDialog(): void {
    this.dialogVisible.set(false);
    this.saving.set(false);
  }

  protected closeDeleteDialog(): void {
    this.deleteDialogVisible.set(false);
  }

  protected async save(): Promise<void> {
    const config = this.config();
    if (!config) {
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.saving.set(true);
    const payload = this.normalizePayload(this.form.getRawValue() as Record<string, unknown>, config.formFields);

    try {
      if (this.currentId()) {
        await firstValueFrom(this.api.update(config.endpoint, this.currentId() as number, payload));
      } else {
        await firstValueFrom(this.api.create(config.endpoint, payload));
      }

      this.dialogVisible.set(false);
      await this.refresh();
    } finally {
      this.saving.set(false);
    }
  }

  protected async confirmDelete(): Promise<void> {
    const config = this.config();
    const id = this.currentId();
    if (!config || id === null) {
      return;
    }

    this.saving.set(true);
    try {
      await firstValueFrom(this.api.delete(config.endpoint, id));
      this.deleteDialogVisible.set(false);
      await this.refresh();
    } finally {
      this.saving.set(false);
    }
  }

  protected getCellValue(item: Record<string, unknown>, key: string): unknown {
    const config = this.config();
    const column = config?.columns.find((entry) => entry.key === key);
    const value = item[key];

    if (column?.type === 'relation') {
      const lookup = this.relationLookup()[key] ?? {};
      return lookup[String(value)] ?? value ?? '-';
    }

    return value === null || value === undefined || value === '' ? '-' : value;
  }

  protected getCurrencyValue(item: Record<string, unknown>, key: string): number | null {
    const value = item[key];
    if (value === null || value === undefined || value === '') {
      return null;
    }

    return Number(value);
  }

  protected fieldOptions(field: AdminResourceFieldConfig): AdminSelectOption[] {
    return this.optionMap()[field.key] ?? field.staticOptions ?? [];
  }

  protected trackByField(_: number, field: AdminResourceFieldConfig): string {
    return field.key;
  }

  private async refresh(): Promise<void> {
    const config = this.config();
    if (!config) {
      return;
    }

    this.loading.set(true);
    try {
      const data = await firstValueFrom(this.api.list<Record<string, unknown>>(config.endpoint));
      this.items.set(data);
    } finally {
      this.loading.set(false);
    }
  }

  private buildForm(config: AdminResourceConfig): void {
    for (const field of config.formFields) {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.type === 'number' && field.min !== undefined) {
        validators.push(Validators.min(field.min));
      }

      this.form.addControl(field.key, this.fb.control('', validators));
    }
  }

  private async loadOptions(config: AdminResourceConfig): Promise<void> {
    const optionState: Record<string, AdminSelectOption[]> = {};
    const relationState: Record<string, Record<string, string>> = {};

    for (const field of config.formFields) {
      if (field.type !== 'select') {
        continue;
      }

      if (field.staticOptions?.length) {
        optionState[field.key] = field.staticOptions;
        relationState[field.key] = Object.fromEntries(field.staticOptions.map((option) => [String(option.value), option.label]));
        continue;
      }

      if (!field.optionsEndpoint) {
        optionState[field.key] = [];
        relationState[field.key] = {};
        continue;
      }

      const records = await firstValueFrom(this.api.list<Record<string, unknown>>(field.optionsEndpoint));
      const options = records.map((item) => {
        const label = this.pickLabel(item, field.optionLabelKeys ?? ['nameEn', 'nameAr', 'titleEn', 'titleAr', 'id']);
        return { label, value: Number(item['id']) };
      });

      optionState[field.key] = options;
      relationState[field.key] = Object.fromEntries(options.map((option) => [String(option.value), option.label]));
    }

    this.optionMap.set(optionState);
    this.relationLookup.set(relationState);
  }

  private createEmptyFormValue(): Record<string, unknown> {
    const config = this.config();
    if (!config) {
      return {};
    }

    return Object.fromEntries(config.formFields.map((field) => [field.key, field.type === 'number' ? 0 : '']));
  }

  private mapItemToFormValue(item: Record<string, unknown>): Record<string, unknown> {
    const config = this.config();
    if (!config) {
      return {};
    }

    return Object.fromEntries(config.formFields.map((field) => [field.key, item[field.key] ?? '']));
  }

  private normalizePayload(value: Record<string, unknown>, fields: AdminResourceFieldConfig[]): Record<string, unknown> {
    return Object.fromEntries(
      fields.map((field) => {
        let fieldValue = value[field.key];

        if (field.type === 'number' || field.type === 'select') {
          fieldValue = fieldValue === '' || fieldValue === null ? 0 : Number(fieldValue);
        }

        if ((field.type === 'text' || field.type === 'textarea' || field.type === 'url') && fieldValue !== null && fieldValue !== undefined) {
          const trimmed = String(fieldValue).trim();
          fieldValue = trimmed === '' && !field.required ? null : trimmed;
        }

        return [field.key, fieldValue];
      }),
    );
  }

  private getPrimaryLabel(item: Record<string, unknown>): string {
    const config = this.config();
    if (!config) {
      return `#${item['id'] ?? ''}`;
    }

    return this.pickLabel(item, config.searchKeys) || `#${item['id'] ?? ''}`;
  }

  private pickLabel(item: Record<string, unknown>, keys: string[]): string {
    const matched = keys.map((key) => item[key]).find((value) => value !== null && value !== undefined && String(value).trim() !== '');
    return matched ? String(matched) : String(item['id'] ?? '');
  }
}
