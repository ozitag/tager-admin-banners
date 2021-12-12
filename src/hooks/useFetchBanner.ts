import { onMounted, Ref, SetupContext, watch } from '@vue/composition-api';

import { Nullable, ResourceRef, useResource } from '@tager/admin-services';

import { getBanner } from '../services/requests';
import { Banner } from '../typings/banners';

export function useFetchBanner({
  context,
  bannerId,
  isCreation,
}: {
  context: SetupContext;
  bannerId: Ref<string>;
  isCreation: Ref<boolean>;
}): ResourceRef<Nullable<Banner>> {
  const [fetchBanner, resource] = useResource<Nullable<Banner>>({
    fetchResource: () => getBanner(bannerId.value),
    initialValue: null,
    context,
    resourceName: 'Banner',
  });

  onMounted(() => {
    if (isCreation.value) {
      return;
    }

    fetchBanner();
  });

  watch(bannerId, () => {
    if (isCreation.value) {
      return;
    }

    fetchBanner();
  });

  return resource;
}
