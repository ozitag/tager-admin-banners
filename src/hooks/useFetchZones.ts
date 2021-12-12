import { onMounted, SetupContext } from '@vue/composition-api';

import { ResourceRef, useResource } from '@tager/admin-services';

import { getZones } from '../services/requests';
import { Zone } from '../typings/zones';

export function useFetchZones(params: {
  context: SetupContext;
}): ResourceRef<Zone[]> {
  const [fetchZones, resource] = useResource<Zone[]>({
    fetchResource: getZones,
    initialValue: [],
    context: params.context,
    resourceName: 'Banner zones',
  });

  onMounted(() => {
    fetchZones();
  });

  return resource;
}
