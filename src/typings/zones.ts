import { FieldConfigUnion } from '@tager/admin-dynamic-field';

export interface Zone {
  id: string;
  name: string;
  bannersCount: number;
}

export interface ZoneFields extends Zone {
  fields: FieldConfigUnion[];
}
