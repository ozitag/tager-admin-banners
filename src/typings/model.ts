import { Nullable, FileType } from '@tager/admin-services';

export type BannerArea = {
  id: number;
  alias: string;
  label: string;
  scenario: string;
};

export type BannerItem = {
  id: number;
  title: string;
  text: string;
  image: Nullable<FileType>;
  buttonLabel: string;
  buttonLink: Nullable<string>;
  buttonIsNewTab: boolean;
};