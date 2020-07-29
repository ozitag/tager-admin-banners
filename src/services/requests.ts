import { request, Nullable, ResponseBody } from '@tager/admin-services';
import { BannerArea, BannerItem } from '../typings/model';

/** Banner area */

export function getBannerAreaList(): Promise<ResponseBody<Array<BannerArea>>> {
  return request.get({ path: '/admin/market-boards' });
}

export function getBannerAreaById(
  areaId: number | string
): Promise<ResponseBody<BannerArea>> {
  return request.get({ path: `/admin/market-boards/${areaId}` });
}

export function getBannerAreaByAlias(
  areaAlias: number | string
): Promise<ResponseBody<BannerArea>> {
  return request.get({ path: `/admin/market-boards/${areaAlias}` });
}

export type BannerAreaCreatePayload = {
  alias: string;
  label: string;
  scenario: string;
};

export function createBannerArea(
  payload: BannerAreaCreatePayload
): Promise<ResponseBody<BannerArea>> {
  return request.post({ path: '/admin/market-boards', body: payload });
}

export type BannerAreaUpdatePayload = BannerAreaCreatePayload;

export function updateBannerArea(
  areaId: number | string,
  payload: BannerAreaUpdatePayload
): Promise<ResponseBody<BannerArea>> {
  return request.put({ path: `/admin/market-boards/${areaId}`, body: payload });
}

export function deleteBannerArea(
  areaId: number | string
): Promise<{ success: boolean }> {
  return request.delete({ path: `/admin/market-boards/${areaId}` });
}

/** Banners */

export function getBannerItemList(
  areaId: number | string
): Promise<ResponseBody<Array<BannerItem>>> {
  return request.get({ path: `/admin/market-boards/${areaId}/items` });
}

export function getBannerItemById(
  bannerItemId: number | string
): Promise<ResponseBody<BannerItem>> {
  return request.get({ path: `/admin/market-boards/items/${bannerItemId}` });
}

export type BannerItemCreatePayload = {
  title: string;
  text: string;
  buttonLink: Nullable<string>;
  buttonLabel: string;
  buttonIsNewTab: boolean;
  image: Nullable<number>;
};

export function createBannerItem(
  areaId: number | string,
  payload: BannerItemCreatePayload
): Promise<ResponseBody<BannerItem>> {
  return request.post({
    path: `/admin/market-boards/${areaId}/items`,
    body: payload,
  });
}

export type BannerItemUpdatePayload = BannerItemCreatePayload;

export function updateBannerItem(
  bannerItemId: number | string,
  payload: BannerItemUpdatePayload
): Promise<ResponseBody<BannerItem>> {
  return request.put({
    path: `/admin/market-boards/items/${bannerItemId}`,
    body: payload,
  });
}

export function deleteBannerItem(
  bannerItemId: number | string
): Promise<{ success: boolean }> {
  return request.delete({ path: `/admin/market-boards/items/${bannerItemId}` });
}

export function moveBannerItem(
  bannerItemId: number | string,
  direction: 'up' | 'down'
): Promise<{ success: boolean }> {
  return request.post({
    path: `/admin/market-boards/items/${bannerItemId}/${direction}`,
  });
}
