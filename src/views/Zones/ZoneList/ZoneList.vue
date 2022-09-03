<template>
  <Page :title="$i18n.t('banners:zones')">
    <template #content>
      <DataTable
        :column-defs="columnDefs"
        :row-data="rowData"
        :loading="isRowDataLoading"
        :error-message="errorMessage"
        data-table="banners-zones"
        :use-search="false"
        :use-pagination="false"
        @change="handleChange"
      >
        <template #cell(banners-count)="{ row }">
          <CountButton
            :href="getLinkToBannersByZone(row.id)"
            variant="outline-secondary"
            :count="row.bannersCount"
          >
            {{ $i18n.t('banners:banners') }}
          </CountButton>
        </template>
      </DataTable>
    </template>
  </Page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, SetupContext } from 'vue';

import { CountButton, useDataTable, DataTable } from '@tager/admin-ui';
import { Page } from '@tager/admin-layout';
import { useI18n } from '@tager/admin-services';

import { Zone } from '../../../typings/zones';
import { getZones } from '../../../services/requests';

import { getColumnDefs, getLinkToBannersByZone } from './ZoneList.helpers';

export default defineComponent({
  name: 'ZoneList',
  components: { CountButton, Page, DataTable },
  setup() {
    const i18n = useI18n();

    const {
      fetchEntityList: fetchZones,
      isLoading: isZonesLoading,
      rowData,
      errorMessage,
      handleChange,
    } = useDataTable<Zone>({
      fetchEntityList: getZones,
      initialValue: [],
      resourceName: 'Banner Zones',
    });

    onMounted(() => {
      fetchZones();
    });

    const columnDefs = computed(() => getColumnDefs(i18n.t));

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
