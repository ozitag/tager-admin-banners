import { type FieldConfigUnion } from '@tager/admin-dynamic-field';

export type Zone = {
  id: string;
  name: string;
  bannersCount: number;
}

export interface ZoneFields extends Zone {
  fields: FieldConfigUnion[];
}
