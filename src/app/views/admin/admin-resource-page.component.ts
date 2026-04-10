import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { firstValueFrom } from 'rxjs';

import { CrudShellComponent } from '../../shared/crud-shell';
import { DialogShellComponent } from '../../shared/dialog-shell/dialog-shell.component';
import { AdminResourceApiService } from './admin-resource-api.service';
import { getAdminResourceConfig } from './admin-resource.config';
import { AdminResourceConfig, AdminResourceFieldConfig, AdminSelectOption } from './admin-resource.models';

@Component({
  selector: 'app-admin-resource-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, RouterLink, CrudShellComponent, DialogShellComponent, TableModule, ButtonModule],
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
  protected readonly dialogVisible = signal(false);
  protected readonly deleteDialogVisible = signal(false);
  protected readonly packagesDialogVisible = signal(false);
  protected readonly saving = signal(false);
  protected readonly packageSaving = signal(false);
  protected readonly currentId = signal<number | null>(null);
  protected readonly editingPackageId = signal<number | null>(null);
  protected readonly selectedItemLabel = signal('');
  protected readonly selectedServiceForPackages = signal<Record<string, unknown> | null>(null);
  protected readonly optionMap = signal<Record<string, AdminSelectOption[]>>({});
  protected readonly relationLookup = signal<Record<string, Record<string, string>>>({});
  protected readonly servicePackages = signal<Record<string, unknown>[]>([]);
  protected readonly selectedFiles = signal<Record<string, File | null>>({});
  protected readonly selectedFilePreviews = signal<Record<string, string | null>>({});
  protected readonly pageSizeOptions = [5, 10, 20, 50];

  protected readonly filteredItems = computed(() => {
    const config = this.config();
    const items = this.items();
    return config?.singleRecord ? items.slice(0, 1) : items;
  });
  protected readonly isServicesResource = computed(() => this.config()?.key === 'services');
  protected readonly showCreateButton = computed(() => {
    const config = this.config();
    if (!config?.singleRecord) {
      return true;
    }

    return this.items().length === 0;
  });

  protected readonly form = new FormGroup<Record<string, FormControl>>({});
  protected readonly packageForm = this.fb.group({
    nameAr: this.fb.nonNullable.control('', Validators.required),
    nameEn: this.fb.nonNullable.control('', Validators.required),
    icon: this.fb.control<string | null>(''),
    costAmount: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
  });

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

  protected openCreateDialog(): void {
    this.currentId.set(null);
    this.selectedItemLabel.set('');
    this.resetFileSelections();
    this.form.reset(this.createEmptyFormValue());
    this.dialogVisible.set(true);
  }

  protected openEditDialog(item: Record<string, unknown>): void {
    this.currentId.set(Number(item['id']));
    this.selectedItemLabel.set(this.getPrimaryLabel(item));
    this.resetFileSelections();
    this.form.reset(this.mapItemToFormValue(item));
    this.dialogVisible.set(true);
  }

  protected openDeleteDialog(item: Record<string, unknown>): void {
    this.currentId.set(Number(item['id']));
    this.selectedItemLabel.set(this.getPrimaryLabel(item));
    this.deleteDialogVisible.set(true);
  }

  protected async openPackagesDialog(item: Record<string, unknown>): Promise<void> {
    this.selectedServiceForPackages.set(item);
    this.packagesDialogVisible.set(true);
    this.startCreatePackage();
    await this.refreshPackages();
  }

  protected closeFormDialog(): void {
    this.dialogVisible.set(false);
    this.saving.set(false);
    this.resetFileSelections();
  }

  protected closeDeleteDialog(): void {
    this.deleteDialogVisible.set(false);
  }

  protected closePackagesDialog(): void {
    this.packagesDialogVisible.set(false);
    this.packageSaving.set(false);
    this.editingPackageId.set(null);
    this.selectedServiceForPackages.set(null);
    this.servicePackages.set([]);
    this.packageForm.reset({
      nameAr: '',
      nameEn: '',
      icon: '',
      costAmount: 0,
    });
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

    try {
      const payload = await this.resolveFileUploads(
        this.normalizePayload(this.form.getRawValue() as Record<string, unknown>, config.formFields),
        config.formFields,
      );

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

  protected getImageUrl(item: Record<string, unknown>, key: string): string | null {
    const value = item[key];
    if (value === null || value === undefined || value === '') {
      return null;
    }

    return this.api.resolveAssetUrl(String(value));
  }

  protected onFileSelected(field: AdminResourceFieldConfig, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFiles.update((state) => ({ ...state, [field.key]: file }));

    if (!file) {
      this.selectedFilePreviews.update((state) => ({ ...state, [field.key]: null }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedFilePreviews.update((state) => ({ ...state, [field.key]: String(reader.result ?? '') }));
    };
    reader.readAsDataURL(file);
  }

  protected clearFileSelection(fieldKey: string, input?: HTMLInputElement): void {
    this.selectedFiles.update((state) => ({ ...state, [fieldKey]: null }));
    this.selectedFilePreviews.update((state) => ({ ...state, [fieldKey]: null }));
    this.form.get(fieldKey)?.setValue('');

    if (input) {
      input.value = '';
    }
  }

  protected getFilePreview(fieldKey: string): string | null {
    const selectedPreview = this.selectedFilePreviews()[fieldKey];
    if (selectedPreview) {
      return selectedPreview;
    }

    const currentValue = this.form.get(fieldKey)?.value;
    return typeof currentValue === 'string' && currentValue.trim() !== '' ? this.api.resolveAssetUrl(currentValue) : null;
  }

  protected fieldOptions(field: AdminResourceFieldConfig): AdminSelectOption[] {
    return this.optionMap()[field.key] ?? field.staticOptions ?? [];
  }

  protected trackByField(_: number, field: AdminResourceFieldConfig): string {
    return field.key;
  }

  protected selectedServicePackagesLabel(): string {
    const service = this.selectedServiceForPackages();
    return service ? this.pickLabel(service, ['nameEn', 'nameAr', 'id']) : 'Service';
  }

  protected packageHeaderActionLabel(): string {
    if (this.packageSaving()) {
      return 'Saving...';
    }

    return this.editingPackageId() ? 'Update Package' : 'Add Package';
  }

  protected startCreatePackage(): void {
    this.editingPackageId.set(null);
    this.packageForm.reset({
      nameAr: '',
      nameEn: '',
      icon: '',
      costAmount: 0,
    });
  }

  protected startEditPackage(item: Record<string, unknown>): void {
    this.editingPackageId.set(Number(item['id']));
    this.packageForm.reset({
      nameAr: String(item['nameAr'] ?? ''),
      nameEn: String(item['nameEn'] ?? ''),
      icon: item['icon'] === null || item['icon'] === undefined ? '' : String(item['icon']),
      costAmount: Number(item['costAmount'] ?? 0),
    });
  }

  protected async savePackage(): Promise<void> {
    const service = this.selectedServiceForPackages();
    if (!service) {
      return;
    }

    this.packageForm.markAllAsTouched();
    if (this.packageForm.invalid) {
      return;
    }

    const payload = {
      serviceId: Number(service['id']),
      nameAr: this.packageForm.controls.nameAr.value.trim(),
      nameEn: this.packageForm.controls.nameEn.value.trim(),
      icon: (this.packageForm.controls.icon.value ?? '').trim() || null,
      costAmount: Number(this.packageForm.controls.costAmount.value),
    };

    this.packageSaving.set(true);
    try {
      const packageId = this.editingPackageId();
      if (packageId) {
        await firstValueFrom(this.api.update('ServicePackages', packageId, payload));
      } else {
        await firstValueFrom(this.api.create('ServicePackages', payload));
      }

      this.startCreatePackage();
      await this.refreshPackages();
    } finally {
      this.packageSaving.set(false);
    }
  }

  protected async deletePackage(item: Record<string, unknown>): Promise<void> {
    const packageId = Number(item['id']);
    const packageLabel = this.pickLabel(item, ['nameEn', 'nameAr', 'id']);
    if (!packageId || !window.confirm(`Delete package "${packageLabel}"?`)) {
      return;
    }

    this.packageSaving.set(true);
    try {
      await firstValueFrom(this.api.delete('ServicePackages', packageId));
      if (this.editingPackageId() === packageId) {
        this.startCreatePackage();
      }
      await this.refreshPackages();
    } finally {
      this.packageSaving.set(false);
    }
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

  private async refreshPackages(): Promise<void> {
    const service = this.selectedServiceForPackages();
    if (!service) {
      this.servicePackages.set([]);
      return;
    }

    const serviceId = Number(service['id']);
    const data = await firstValueFrom(this.api.list<Record<string, unknown>>('ServicePackages'));
    this.servicePackages.set(data.filter((item) => Number(item['serviceId']) === serviceId));
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

        if ((field.type === 'text' || field.type === 'textarea' || field.type === 'url' || field.type === 'file') && fieldValue !== null && fieldValue !== undefined) {
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

  private async resolveFileUploads(
    payload: Record<string, unknown>,
    fields: AdminResourceFieldConfig[],
  ): Promise<Record<string, unknown>> {
    const updatedPayload = { ...payload };

    for (const field of fields) {
      if (field.type !== 'file') {
        continue;
      }

      const selectedFile = this.selectedFiles()[field.key];
      if (!selectedFile) {
        continue;
      }

      const folder = field.uploadFolder ?? this.config()?.key ?? 'uploads';
      const response = await firstValueFrom(this.api.uploadFile(selectedFile, folder));
      updatedPayload[field.key] = response.url;
    }

    return updatedPayload;
  }

  private resetFileSelections(): void {
    this.selectedFiles.set({});
    this.selectedFilePreviews.set({});
  }
}
