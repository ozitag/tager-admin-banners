<template>
  <page
    :title="$t('banners:banners')"
    :header-buttons="[
      {
        text: $t('banners:createBanner'),
        href: getBannersBannerFormUrl({ bannerId: 'create' }),
      },
    ]"
  >
    <template v-slot:content>
      <data-table
        :column-defs="columnDefs"
        :row-data="rowData"
        :loading="isRowDataLoading"
        :error-message="errorMessage"
        data-table="banners"
        :use-search="true"
        :use-pagination="true"
        :search-query="searchQuery"
        :pagination="{
          pageNumber,
          pageCount,
          pageSize,
          disabled: isRowDataLoading,
        }"
        @change="handleChange"
      >
        <template v-slot:filters>
          <advanced-search :tags="tags" @click:tag="tagRemovalHandler">
            <div class="filters">
              <form-field-multi-select
                v-model="zoneFilter"
                :options="zonesOptionList"
                name="zoneFilter"
                :searchable="true"
                :label="$t('banners:zone')"
                class="filter"
              />

              <form-field
                v-model="dateFilter"
                :label="$t('banners:date')"
                name="dateFilter"
                type="date"
                class="filter"
              />

              <form-field-multi-select
                v-model="statusFilter"
                :options="statusesOptionList"
                name="statusFilter"
                :searchable="true"
                :label="$t('banners:status')"
                class="filter"
              />
            </div>
          </advanced-search>
        </template>

        <template v-slot:cell(actions)="{ row }">
          <base-button
            variant="icon"
            :title="$t('banners:edit')"
            :disabled="isBusy(row.id)"
            :href="getBannersBannerFormUrl({ bannerId: row.id })"
          >
            <svg-icon name="edit" />
          </base-button>

          <base-button
            variant="icon"
            :title="$t('banners:remove')"
            :disabled="isBusy(row.id)"
            @click="handleResourceDelete(row.id)"
          >
            <svg-icon name="delete" />
          </base-button>
        </template>
      </data-table>
    </template>
  </page>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  SetupContext,
  watch,
} from '@vue/composition-api';
import isEqual from 'lodash.isequal';
import pick from 'lodash.pick';

import {
  ColumnDefinition,
  useDataTable,
  useTranslation,
} from '@tager/admin-ui';
import { useResourceDelete } from '@tager/admin-services';

import { deleteBanner, getBanners } from '../../../services/requests';
import { Banner } from '../../../typings/banners';
import { getBannersBannerFormUrl } from '../../../constants/paths';
import { useFetchZones } from '../../../hooks';

import { getColumnDefs } from './BannerList.helpers';
import { useAdvancedSearch } from './hooks';

export default defineComponent({
  name: 'BannerList',
  setup(props, context: SetupContext) {
    const { t } = useTranslation(context);
    const { loading: isZonesLoading, data: zoneList } = useFetchZones({
      context,
    });

    const {
      zoneFilter,
      zonesOptionList,
      dateFilter,
      statusFilter,
      statusesOptionList,
      filterParams,
      tags,
      tagRemovalHandler,
    } = useAdvancedSearch({
      context,
      t,
      zoneList,
    });

    const {
      fetchEntityList: fetchBanners,
      isLoading: isBannersLoading,
      rowData,
      errorMessage,
      handleChange,
      searchQuery,
      pageNumber,
      pageCount,
      pageSize,
    } = useDataTable<Banner>({
      fetchEntityList: (params) =>
        getBanners({
          query: params.searchQuery,
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          ...filterParams.value,
        }),
      initialValue: [],
      context,
      resourceName: 'Banners',
    });

    watch(filterParams, () => {
      if (isZonesLoading.value) {
        return;
      }

      const newQuery = {
        ...pick(context.root.$route.query, ['query', 'pageNumber']),
        ...filterParams.value,
      };

      if (!isEqual(context.root.$route.query, newQuery)) {
        context.root.$router.replace({ query: newQuery });
        fetchBanners();
      }
    });

    const { isDeleting, handleResourceDelete } = useResourceDelete({
      deleteResource: deleteBanner,
      resourceName: 'Banner',
      onSuccess: fetchBanners,
      context,
    });

    const isBusy = (bannerId: number): boolean => {
      return isDeleting(bannerId) || isBannersLoading.value;
    };

    const columnDefs = computed<ColumnDefinition<Banner>[]>(() =>
      getColumnDefs(zoneList.value, context.root.$t)
    );

    const isRowDataLoading = computed<boolean>(
      () => isBannersLoading.value || isZonesLoading.value
    );

    return {
      columnDefs,
      isRowDataLoading,
      rowData,
      errorMessage,
      handleChange,
      getBannersBannerFormUrl,
      searchQuery,
      pageNumber,
      pageCount,
      pageSize,
      isBusy,
      handleResourceDelete,

      // Advanced search
      zoneFilter,
      zonesOptionList,
      dateFilter,
      statusFilter,
      statusesOptionList,
      tags,
      tagRemovalHandler,
    };
  },
});
</script>

<style lang="scss">
.filters {
  display: flex;
  margin: 0 -10px;

  &:not(:first-child) {
    margin-top: 10px;
  }

  .filter {
    padding: 10px 10px 0;
    width: 50%;
    margin: 0;
  }
}
</style>
