import { computed, onMounted, type Ref, type SetupContext, watch } from 'vue';

import { type Nullable, type ResourceRef, useResource } from '@tager/admin-services';

import { getZoneFields } from '../services/requests';
import { type ZoneFields } from '../typings/zones';
import { type BannerFormValues } from '../typings/banners';

export function useFetchZoneFields({
  values,
}: {
  values: Ref<BannerFormValues>;
}): ResourceRef<Nullable<ZoneFields>> {
  const zoneId = computed(() => values.value.bannerZone?.value ?? '');

  const [fetchZoneFields, resource] = useResource<Nullable<ZoneFields>>({
    fetchResource: () => getZoneFields(zoneId.value),
    initialValue: null,
    resourceName: 'Zone Fields',
  });

  onMounted(() => {
    if (!zoneId.value) {
      return;
    }

    fetchZoneFields();
  });

  watch(zoneId, () => {
    if (!zoneId.value) {
      return;
    }

    fetchZoneFields();
  });

  return resource;
}
