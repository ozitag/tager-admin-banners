import { onMounted, SetupContext } from '@vue/composition-api';

import { ResourceRef, useResource } from '@tager/admin-services';

import { getBanners } from '../services/requests';
import { Banner } from '../typings/banners';

export function useFetchBanners(params: {
  context: SetupContext;
}): ResourceRef<Banner[]> {
  const [fetchBanners, resource] = useResource<Banner[]>({
    fetchResource: getBanners,
    initialValue: [],
    context: params.context,
    resourceName: 'Banners',
  });

  onMounted(() => {
    fetchBanners();
  });

  return resource;
}
