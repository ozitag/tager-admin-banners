import { CustomRoute, CustomRouteConfig } from '@tager/admin-layout';

import BannerAreaList from '../views/BannerAreaList.vue';
import BannerAreaForm from '../views/BannerAreaForm.vue';
import BannerItemList from '../views/BannerItemList.vue';
import BannerItemForm from '../views/BannerItemForm.vue';

import { BANNER_ROUTE_PATHS, getBannerItemListUrl } from './paths';

const HOME_BREADCRUMB = { url: '/', text: 'Home' };

export const BANNER_AREA_LIST_ROUTE: CustomRouteConfig = {
  path: BANNER_ROUTE_PATHS.AREA_LIST,
  component: BannerAreaList,
  name: 'Banner Area List',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      { url: route.path, text: route.name ?? '' },
    ],
  },
};

export const BANNER_AREA_FORM_ROUTE: CustomRouteConfig = {
  path: BANNER_ROUTE_PATHS.AREA_FORM,
  component: BannerAreaForm,
  name: 'Banner Area Form',
  meta: {
    getBreadcrumbs: (route: CustomRoute) => [
      HOME_BREADCRUMB,
      {
        url: BANNER_ROUTE_PATHS.AREA_LIST,
        text: BANNER_AREA_LIST_ROUTE.name ?? '',
      },
      { url: route.path, text: route.name ?? '' },
    ],
  },
};

export const BANNER_ITEM_LIST_ROUTE: CustomRouteConfig = {
  path: BANNER_ROUTE_PATHS.ITEM_LIST,
  component: BannerItemList,
  name: 'Banner Item List',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      { url: route.path, text: route.name ?? '' },
    ],
  },
};

export const BANNER_ITEM_FORM_ROUTE: CustomRouteConfig = {
  path: BANNER_ROUTE_PATHS.ITEM_FORM,
  component: BannerItemForm,
  name: 'Banner Item Form',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      {
        url: getBannerItemListUrl({ areaAlias: route.params.areaAlias }),
        text: BANNER_ITEM_LIST_ROUTE.name ?? '',
      },
      { url: route.path, text: route.name ?? '' },
    ],
  },
};
