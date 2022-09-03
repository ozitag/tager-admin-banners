import { onMounted } from 'vue';

import { ResourceRef, useResource } from '@tager/admin-services';

import { getZones } from '../services/requests';
import { Zone } from '../typings/zones';

export function useFetchZones(): ResourceRef<Zone[]> {
  const [fetchZones, resource] = useResource<Zone[]>({
    fetchResource: getZones,
    initialValue: [],
    resourceName: 'Banner zones',
  });

  onMounted(() => {
    fetchZones();
  });

  return resource;
}
