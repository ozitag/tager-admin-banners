import { onMounted, SetupContext } from 'vue';

import { ResourceRef, useResource } from '@tager/admin-services';

import { getBanners } from '../services/requests';
import { Banner } from '../typings/banners';

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
