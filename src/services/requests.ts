import { request, ResponseBody } from '@tager/admin-services';

import { Zone } from '../typings/zones';
import { Banner, BannerPayload } from '../typings/banners';

/** Zones **/

export function getZones(params?: {
  query?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<ResponseBody<Zone[]>> {
  return request.get({ path: '/admin/adv/zones', params });
}

/** Banners **/

export function getBanners(params?: {
  query?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<ResponseBody<Banner[]>> {
  return request.get({ path: '/admin/adv', params });
}

export function getBanner(
  bannerId: number | string
): Promise<ResponseBody<Banner>> {
  return request.get({ path: `/admin/adv/${bannerId}` });
}

export function createBanner(
  payload: BannerPayload
): Promise<ResponseBody<Banner>> {
  return request.post({ path: '/admin/adv', body: payload });
}

export function updateBanner(
  bannerId: number | string,
  payload: BannerPayload
): Promise<ResponseBody<Banner>> {
  return request.put({
    path: `/admin/adv/${bannerId}`,
    body: payload,
  });
}

export function deleteBanner(
  bannerId: number | string
): Promise<{ success: boolean }> {
  return request.delete({ path: `/admin/banners/${bannerId}` });
}
