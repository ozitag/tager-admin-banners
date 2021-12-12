import { compile } from 'path-to-regexp';

export const BANNERS_ROUTE_PATHS = {
  ZONE_LIST: '/banners/zones',
  BANNER_LIST: '/banners',
  BANNER_FORM: '/banners/:bannerId',
} as const;

export function getBannersZoneListUrl() {
  return BANNERS_ROUTE_PATHS.ZONE_LIST;
}

export function getBannersBannerListUrl() {
  return BANNERS_ROUTE_PATHS.BANNER_LIST;
}

export function getBannersBannerFormUrl(params: { bannerId: number | string }) {
  return compile(BANNERS_ROUTE_PATHS.BANNER_FORM)(params);
}
