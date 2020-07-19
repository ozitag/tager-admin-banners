import { CustomRoute, CustomRouteConfig } from '@tager/admin-layout';

import BannerAreaList from '../views/BannerAreaList.vue';
import BannerAreaForm from '../views/BannerAreaForm.vue';
import BannerItemList from '../views/BannerItemList.vue';
import BannerItemForm from '../views/BannerItemForm.vue';

import { BANNER_ROUTE_PATHS } from './paths';

const HOME_BREADCRUMB = { path: '/', label: 'Home' };

export const BANNER_AREA_LIST_ROUTE: CustomRouteConfig = {
  path: BANNER_ROUTE_PATHS.AREA_LIST,
  component: BannerAreaList,
  name: 'Banner Area List',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      { path: route.path, label: route.name },
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
        path: BANNER_ROUTE_PATHS.AREA_LIST,
        label: BANNER_AREA_LIST_ROUTE.name,
      },
      { path: route.path, label: route.name },
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
      { path: route.path, label: route.name },
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
      { path: route.path, label: route.name },
    ],
  },
};
