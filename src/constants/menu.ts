import { MenuItemType } from '@tager/admin-layout';

export const BANNER_MENU_ITEM: MenuItemType = {
  id: 'banner',
  text: 'Banners',
  icon: 'viewList',
  children: [
    { text: 'Banner areas', url: '/banners' },
    { text: 'Create banner area', url: '/banners/create' },
  ],
};
