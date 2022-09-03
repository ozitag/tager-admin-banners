import { compile } from 'path-to-regexp';

import { BANNERS_ROUTE_PATHS } from '../constants/paths';

export function getBannersZoneListUrl() {
  return BANNERS_ROUTE_PATHS.ZONE_LIST;
}

export function getBannersBannerListUrl() {
  return BANNERS_ROUTE_PATHS.BANNER_LIST;
}

export function getBannersBannerFormUrl(params: { bannerId: number | string }) {
  return compile(BANNERS_ROUTE_PATHS.BANNER_FORM)(params);
}
