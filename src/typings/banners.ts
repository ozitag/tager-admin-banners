import { FileType, Nullable } from '@tager/admin-services';
import { OptionType, SingleFileInputValueType } from '@tager/admin-ui';

export enum Status {
  Waiting = 'WAITING',
  Archived = 'ARCHIVED',
  Active = 'ACTIVE',
  Disabled = 'DISABLED',
}

export interface Banner {
  id: number;
  status: Status;
  link: Nullable<string>;
  image: Nullable<FileType>;
  bannerZone: Nullable<string>;
  openNewTab: boolean;
  dateStart: Nullable<string>;
  dateEnd: Nullable<string>;
  disabled: boolean;
  comment: Nullable<string>;
}

export interface BannerFormValues {
  link: Nullable<string>;
  image: Nullable<SingleFileInputValueType>;
  bannerZone: Nullable<OptionType>;
  openNewTab: boolean;
  dateStart: string;
  dateEnd: string;
  disabled: boolean;
  comment: string;
}

export interface BannerPayload {
  link: Nullable<string>;
  image: Nullable<string>;
  bannerZone: string;
  openNewTab: boolean;
  dateStart: string;
  dateEnd: string;
  disabled: boolean;
  comment: string;
}