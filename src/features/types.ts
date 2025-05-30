export type FieldDefinition = {
  label: string;
  required?: boolean;
  readOnly?: boolean;
  nullable?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

export type MetaSchema = Record<string, FieldDefinition>;

export type DataPage<T> = {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
};
