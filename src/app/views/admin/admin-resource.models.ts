export type AdminFieldType = 'text' | 'textarea' | 'number' | 'url' | 'select' | 'file';

export interface AdminSelectOption {
  label: string;
  value: string | number;
}

export interface AdminResourceFieldConfig {
  key: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  min?: number;
  step?: number | string;
  staticOptions?: AdminSelectOption[];
  optionsEndpoint?: string;
  optionLabelKeys?: string[];
  accept?: string;
  uploadFolder?: string;
}

export interface AdminResourceColumnConfig {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'currency' | 'relation' | 'image';
}

export interface AdminResourceConfig {
  key: string;
  title: string;
  subtitle: string;
  endpoint: string;
  icon: string;
  singleRecord?: boolean;
  tableTitle: string;
  createLabel: string;
  emptyTitle: string;
  emptyMessage: string;
  searchKeys: string[];
  columns: AdminResourceColumnConfig[];
  formFields: AdminResourceFieldConfig[];
}
