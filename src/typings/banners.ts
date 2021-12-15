import { FileType, Nullable } from '@tager/admin-services';
import { OptionType, SingleFileInputValueType } from '@tager/admin-ui';
import {
  FieldShortType,
  FieldUnion,
  IncomingValueUnion,
  OutgoingValueUnion,
} from '@tager/admin-dynamic-field';

export enum Status {
  Waiting = 'WAITING',
  Archived = 'ARCHIVED',
  Active = 'ACTIVE',
  Disabled = 'DISABLED',
}

export interface Banner {
  id: number;
  status: Status;
  priority: number;
  link: Nullable<string>;
  image: Nullable<FileType>;
  bannerZone: Nullable<string>;
  openNewTab: boolean;
  dateStart: Nullable<string>;
  dateEnd: Nullable<string>;
  disabled: boolean;
  comment: Nullable<string>;
  fields: FieldShortType<IncomingValueUnion>[];
}

export interface BannerFormValues {
  link: Nullable<string>;
  image: Nullable<SingleFileInputValueType>;
  bannerZone: Nullable<OptionType>;
  priority: string;
  openNewTab: boolean;
  dateStart: string;
  dateEnd: string;
  disabled: boolean;
  comment: string;
  fields: FieldUnion[];
}

export interface BannerPayload {
  link: Nullable<string>;
  image: Nullable<string>;
  priority: number;
  bannerZone: string;
  openNewTab: boolean;
  dateStart: Nullable<string>;
  dateEnd: Nullable<string>;
  disabled: boolean;
  comment: string;
  fields: FieldShortType<OutgoingValueUnion>[];
}
