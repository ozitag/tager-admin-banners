<template>
  <Page
    :title="$i18n.t('banners:banners')"
    :header-buttons="[
      {
        text: $i18n.t('banners:createBanner'),
        href: getBannersBannerFormUrl({ bannerId: 'create' }),
      },
    ]"
  >
    <template #content>
      <DataTable
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
        <template #filters>
          <AdvancedSearch :tags="tags" @click:tag="tagRemovalHandler">
            <div class="filters">
              <FormFieldMultiSelect
                v-model:selected-options="zoneFilter"
                :options="zonesOptionList"
                name="zoneFilter"
                :searchable="true"
                :label="$i18n.t('banners:zone')"
                class="filter"
              />

              <FormField
                v-model:value="dateFilter"
                :label="$i18n.t('banners:date')"
                name="dateFilter"
                type="date"
                class="filter"
              />

              <FormFieldMultiSelect
                v-model:selected-options="statusFilter"
                :options="statusesOptionList"
                name="statusFilter"
                :searchable="true"
                :label="$i18n.t('banners:status')"
                class="filter"
              />
            </div>
          </AdvancedSearch>
        </template>

        <template #cell(actions)="{ row }">
          <BaseButton
            variant="icon"
            :title="$i18n.t('banners:edit')"
            :disabled="isBusy(row.id)"
            :href="getBannersBannerFormUrl({ bannerId: row.id })"
          >
            <EditIcon />
          </BaseButton>

          <BaseButton
            variant="icon"
            :title="$i18n.t('banners:remove')"
            :disabled="isBusy(row.id)"
            @click="handleResourceDelete(row.id)"
          >
            <DeleteIcon />
          </BaseButton>
        </template>
      </DataTable>
    </template>
  </Page>
</template>

<script lang="ts">
import { computed, defineComponent, SetupContext, watch } from 'vue';
import isEqual from 'lodash.isequal';
import pick from 'lodash.pick';
import { useRoute, useRouter } from 'vue-router';

import {
  ColumnDefinition,
  useDataTable,
  DataTable,
  AdvancedSearch,
  FormFieldMultiSelect,
  FormField,
  BaseButton,
  EditIcon,
  DeleteIcon,
} from '@tager/admin-ui';
import { useI18n, useResourceDelete } from '@tager/admin-services';
import { Page } from '@tager/admin-layout';

import { deleteBanner, getBanners } from '../../../services/requests';
import { Banner } from '../../../typings/banners';
import { getBannersBannerFormUrl } from '../../../utils/paths';
import { useFetchZones } from '../../../hooks';

import { getColumnDefs } from './BannerList.helpers';
import { useAdvancedSearch } from './hooks';

export default defineComponent({
  name: 'BannerList',
  components: {
    DeleteIcon,
    EditIcon,
    BaseButton,
    FormField,
    FormFieldMultiSelect,
    AdvancedSearch,
    Page,
    DataTable,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();

    const { loading: isZonesLoading, data: zoneList } = useFetchZones();

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
      t,
      zoneList,
      route,
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
      resourceName: 'Banners',
    });

    watch(filterParams, () => {
      if (isZonesLoading.value) {
        return;
      }

      const newQuery = {
        ...pick(route.query, ['query', 'pageNumber']),
        ...filterParams.value,
      };

      if (!isEqual(route.query, newQuery)) {
        router.replace({ query: newQuery });
        fetchBanners();
      }
    });

    const { isDeleting, handleResourceDelete } = useResourceDelete({
      deleteResource: deleteBanner,
      resourceName: 'Banner',
      onSuccess: fetchBanners,
    });

    const isBusy = (bannerId: number): boolean => {
      return isDeleting(bannerId) || isBannersLoading.value;
    };

    const columnDefs = computed<ColumnDefinition<Banner>[]>(() =>
      getColumnDefs(zoneList.value, t)
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
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
