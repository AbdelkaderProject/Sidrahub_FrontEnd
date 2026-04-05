export type AdminFieldType = 'text' | 'textarea' | 'number' | 'url' | 'select';

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
}

export interface AdminResourceColumnConfig {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'currency' | 'relation';
}

export interface AdminResourceConfig {
  key: string;
  title: string;
  subtitle: string;
  endpoint: string;
  icon: string;
  tableTitle: string;
  createLabel: string;
  emptyTitle: string;
  emptyMessage: string;
  searchKeys: string[];
  columns: AdminResourceColumnConfig[];
  formFields: AdminResourceFieldConfig[];
}
