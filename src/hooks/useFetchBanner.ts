import { onMounted, Ref, watch } from 'vue';

import { Nullable, ResourceRef, useResource } from '@tager/admin-services';

import { getBanner } from '../services/requests';
import { Banner } from '../typings/banners';

export function useFetchBanner({
  bannerId,
  isCreation,
}: {
  bannerId: Ref<string>;
  isCreation: Ref<boolean>;
}): ResourceRef<Nullable<Banner>> {
  const [fetchBanner, resource] = useResource<Nullable<Banner>>({
    fetchResource: () => getBanner(bannerId.value),
    initialValue: null,
    resourceName: 'Banner',
  });

  onMounted(() => {
    if (isCreation.value || !bannerId.value) {
      return;
    }

    fetchBanner();
  });

  watch(bannerId, () => {
    if (isCreation.value || !bannerId.value) {
      return;
    }

    fetchBanner();
  });

  return resource;
}
