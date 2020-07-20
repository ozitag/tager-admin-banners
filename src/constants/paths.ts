import { compile } from 'path-to-regexp';

export const BANNER_ROUTE_PATHS = {
  AREA_LIST: '/banners',
  AREA_FORM: '/banners/:areaId',
  ITEM_LIST: '/banners/:areaAlias/items',
  ITEM_FORM: '/banners/:areaAlias/items/:itemId',
} as const;

export function getBannerAreaListUrl(): string {
  return BANNER_ROUTE_PATHS.AREA_LIST;
}

export function getBannerAreaFormUrl(params: {
  areaId: string | number;
}): string {
  return compile(BANNER_ROUTE_PATHS.AREA_FORM)({
    areaId: params.areaId,
  });
}

export function getBannerItemListUrl(params: { areaAlias: string }): string {
  return compile(BANNER_ROUTE_PATHS.ITEM_LIST)({
    areaAlias: params.areaAlias,
  });
}

export function getBannerItemFormUrl(params: {
  areaAlias: string;
  itemId: string | number;
}): string {
  return compile(BANNER_ROUTE_PATHS.ITEM_FORM)({
    areaAlias: params.areaAlias,
    itemId: params.itemId,
  });
}
