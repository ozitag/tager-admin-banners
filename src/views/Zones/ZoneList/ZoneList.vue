<template>
  <page :title="$t('banners:zones')">
    <template v-slot:content>
      <data-table
        :column-defs="columnDefs"
        :row-data="rowData"
        :loading="isRowDataLoading"
        :error-message="errorMessage"
        data-table="banners-zones"
        :use-search="false"
        :use-pagination="false"
        @change="handleChange"
      >
        <template v-slot:cell(banners-count)="{ row }">
          <count-button
            :href="getLinkToBannersByZone(row.id)"
            variant="outline-secondary"
            :count="row.bannersCount"
          >
            {{ $t('banners:banners') }}
          </count-button>
        </template>
      </data-table>
    </template>
  </page>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  SetupContext,
} from '@vue/composition-api';

import { useDataTable } from '@tager/admin-ui';

import { Zone } from '../../../typings/zones';
import { getZones } from '../../../services/requests';

import { getColumnDefs, getLinkToBannersByZone } from './ZoneList.helpers';

export default defineComponent({
  name: 'ZoneList',
  setup(props, context: SetupContext) {
    const {
      fetchEntityList: fetchZones,
      isLoading: isZonesLoading,
      rowData,
      errorMessage,
      handleChange,
    } = useDataTable<Zone>({
      fetchEntityList: getZones,
      initialValue: [],
      context,
      resourceName: 'Banner Zones',
    });

    onMounted(() => {
      fetchZones();
    });

    const columnDefs = computed(() => getColumnDefs(context.root.$t));

    return {
      columnDefs,
      isRowDataLoading: isZonesLoading,
      rowData,
      errorMessage,
      handleChange,
      getLinkToBannersByZone,
    };
  },
});
</script>
