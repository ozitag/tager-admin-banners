import { onMounted, type SetupContext } from 'vue';

import { type ResourceRef, useResource } from '@tager/admin-services';

import { getBanners } from '../services/requests';
import { type Banner } from '../typings/banners';

export function useFetchBanners(): ResourceRef<Banner[]> {
  const [fetchBanners, resource] = useResource<Banner[]>({
    fetchResource: getBanners,
    initialValue: [],
    resourceName: 'Banners',
  });

  onMounted(() => {
    fetchBanners();
  });

  return resource;
}
