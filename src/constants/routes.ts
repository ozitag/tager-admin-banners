import { CustomRouteConfig } from '@tager/admin-layout';

import ZoneList from '../views/Zones/ZoneList';
import BannerList from '../views/Banners/BannerList';
import BannerForm from '../views/Banners/BannerForm';

import { BANNERS_ROUTE_PATHS } from './paths';

export const BANNERS_ZONE_LIST_ROUTE: CustomRouteConfig = {
  path: BANNERS_ROUTE_PATHS.ZONE_LIST,
  component: ZoneList,
  name: 'Zones',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('banners:home') },
      { url: BANNERS_ROUTE_PATHS.ZONE_LIST, text: t('banners:zones') },
    ],
  },
};

export const BANNERS_BANNER_LIST_ROUTE: CustomRouteConfig = {
  path: BANNERS_ROUTE_PATHS.BANNER_LIST,
  component: BannerList,
  name: 'Banners',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('banners:home') },
      { url: BANNERS_ROUTE_PATHS.BANNER_LIST, text: t('banners:banners') },
    ],
  },
};

export const BANNERS_BANNER_FORM_ROUTE: CustomRouteConfig = {
  path: BANNERS_ROUTE_PATHS.BANNER_FORM,
  component: BannerForm,
  name: 'Banner Form',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('banners:home') },
      { url: BANNERS_ROUTE_PATHS.BANNER_LIST, text: t('banners:banners') },
      { url: route.path, text: t('banners:bannerForm') },
    ],
  },
};
