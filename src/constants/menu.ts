import { MenuItemType } from '@tager/admin-layout';
import { TranslateFunction } from '@tager/admin-services';

import {
  getBannersZoneListUrl,
  getBannersBannerListUrl,
  getBannersBannerFormUrl,
} from './paths';

export function getBannersMenuItem(params: {
  t: TranslateFunction;
}): MenuItemType {
  return {
    id: 'banners',
    text: params.t('banners:banners'),
    icon: 'viewList',
    children: [
      { text: params.t('banners:zones'), url: getBannersZoneListUrl() },
      { text: params.t('banners:banners'), url: getBannersBannerListUrl() },
      {
        text: params.t('banners:createBanner'),
        url: getBannersBannerFormUrl({ bannerId: 'create' }),
      },
    ],
  };
}
