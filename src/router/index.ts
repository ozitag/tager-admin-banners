import {
  createRouter,
  CustomRoute,
  CustomRouteConfig,
} from '@tager/admin-layout';

import Home from '@/views/Home.vue';

import {
  BANNERS_ZONE_LIST_ROUTE,
  BANNERS_BANNER_LIST_ROUTE,
  BANNERS_BANNER_FORM_ROUTE,
} from '../constants/routes';

export const HOME_ROUTE: CustomRouteConfig = {
  path: '/',
  component: Home,
  name: 'Home',
  meta: {
    getBreadcrumbs: (route: CustomRoute) => [
      { url: '/', text: route.name ?? '' },
    ],
  },
};

const router = createRouter(
  {
    routes: [
      HOME_ROUTE,
      BANNERS_ZONE_LIST_ROUTE,
      BANNERS_BANNER_LIST_ROUTE,
      BANNERS_BANNER_FORM_ROUTE,
    ],
  },
  { useTitleSync: false }
);

export default router;
