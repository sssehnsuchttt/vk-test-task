export type getTicketsType = {
    page?: number;
    perPage?: number;
}

type BaseField = {
  label: string;
  type: string;
  required?: boolean;
  readOnly?: boolean;
  nullable?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

type EnumField = BaseField & {
  type: 'enum';
  options: string[];
  labelMap: Record<string, string>;
};

type StringField = BaseField & {
  type: 'string';
};

type BooleanField = BaseField & {
  type: 'boolean';
};

type DatetimeField = BaseField & {
  type: 'datetime';
};

type FieldDefinition = StringField | EnumField | BooleanField | DatetimeField;

export type MetaSchema = Record<string, FieldDefinition>;