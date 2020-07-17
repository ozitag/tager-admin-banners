import { MenuItemType } from '@tager/admin-layout';

export const BANNER_MENU_ITEM: MenuItemType = {
  id: 'banner',
  name: 'Banners',
  path: '',
  icon: 'viewList',
  children: [
    { name: 'Banner areas', path: '/banners' },
    { name: 'Create banner area', path: '/banners/create' },
  ],
};
