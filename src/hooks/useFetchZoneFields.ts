import { computed, onMounted, Ref, SetupContext, watch } from 'vue';

import { Nullable, ResourceRef, useResource } from '@tager/admin-services';

import { getZoneFields } from '../services/requests';
import { ZoneFields } from '../typings/zones';
import { BannerFormValues } from '../typings/banners';

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
