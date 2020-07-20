<template>
  <page
    title="Banner Areas"
    :header-buttons="[
      { text: 'New banner area', href: getBannerAreaUrl('create') },
    ]"
  >
    <template v-slot:content>
      <base-table
        :column-defs="columnDefs"
        :row-data="rowData"
        :loading="isRowDataLoading"
        :error-message="errorMessage"
      >
        <template v-slot:cell(link-to-banner-items)="{ row }">
          <base-button
            :href="getLinkToBannerItems(row.alias)"
            variant="outline-secondary"
          >
            Banner Items
          </base-button>
        </template>

        <template v-slot:cell(actions)="{ row }">
          <base-button
            variant="icon"
            title="Edit"
            :disabled="deletingBannerAreaIdList.includes(row.id)"
            :href="getBannerAreaUrl(row.id)"
          >
            <svg-icon name="edit"></svg-icon>
          </base-button>
          <base-button
            variant="icon"
            title="Remove"
            :disabled="deletingBannerAreaIdList.includes(row.id)"
            @click="handleBannerAreaDelete(row)"
          >
            <svg-icon name="delete"></svg-icon>
          </base-button>
        </template>
      </base-table>
    </template>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';
import { ColumnDefinition } from '@tager/admin-ui';
import { getMessageFromError, Nullable } from '@tager/admin-services';

import { BannerArea } from '../typings/model';
import { deleteBannerArea, getBannerAreaList } from '../services/requests';
import { getBannerAreaFormUrl, getBannerItemListUrl } from '../constants/paths';

const COLUMN_DEFS: Array<ColumnDefinition<BannerArea>> = [
  {
    id: 1,
    name: 'ID',
    field: 'id',
    style: { width: '50px', textAlign: 'center' },
    headStyle: { width: '50px', textAlign: 'center' },
  },
  { id: 2, name: 'Alias', field: 'alias' },
  { id: 3, name: 'Label', field: 'label' },
  { id: 4, name: 'Scenario', field: 'scenario' },
  {
    id: 6,
    name: 'Banner Items',
    field: 'linkToBannerItems',
    style: { whiteSpace: 'nowrap', width: '120px', textAlign: 'center' },
    headStyle: { whiteSpace: 'nowrap', width: '120px', textAlign: 'center' },
  },
  {
    id: 8,
    name: 'Actions',
    field: 'actions',
    style: { whiteSpace: 'nowrap', width: '110px', textAlign: 'center' },
    headStyle: { whiteSpace: 'nowrap', width: '110px', textAlign: 'center' },
  },
];

export default Vue.extend({
  name: 'BannerAreaList',
  data(): {
    columnDefs: Array<ColumnDefinition<BannerArea>>;
    rowData: Array<BannerArea>;
    deletingBannerAreaIdList: Array<number>;
    isRowDataLoading: boolean;
    errorMessage: Nullable<string>;
  } {
    return {
      columnDefs: COLUMN_DEFS,
      rowData: [],
      deletingBannerAreaIdList: [],
      isRowDataLoading: false,
      errorMessage: null,
    };
  },
  mounted(): void {
    this.refreshBannerAreaList();
  },
  methods: {
    getBannerAreaUrl(areaId: number | string): string {
      return getBannerAreaFormUrl({ areaId });
    },
    refreshBannerAreaList(): Promise<void> {
      this.isRowDataLoading = true;

      return getBannerAreaList()
        .then((response) => {
          this.rowData = response.data;
          this.errorMessage = null;
        })
        .catch((error) => {
          console.error(error);
          this.rowData = [];
          this.errorMessage = getMessageFromError(error);
        })
        .finally(() => {
          this.isRowDataLoading = false;
        });
    },
    handleBannerAreaDelete(bannerArea: BannerArea) {
      const shouldDeleteBannerArea = confirm(
        `Are you sure you want to delete banner area "${bannerArea.label}"`
      );

      if (!shouldDeleteBannerArea) return;

      this.deletingBannerAreaIdList.push(bannerArea.id);

      deleteBannerArea(bannerArea.id)
        .then((response) => {
          if (response.success) {
            this.refreshBannerAreaList().then(() => {
              this.deletingBannerAreaIdList.filter(
                (id) => id !== bannerArea.id
              );
            });
            this.$toast({
              variant: 'success',
              title: 'Success',
              body: 'Banner area was successfully removed',
            });
          } else {
            this.$toast({
              variant: 'danger',
              title: 'Error',
              body: 'Banner area deletion was failed',
            });
          }
        })
        .catch((error) => {
          console.error(error);
          this.$toast({
            variant: 'danger',
            title: 'Error',
            body: 'Banner area deletion was failed',
          });
        });
    },
    getLinkToBannerItems(areaAlias: string) {
      return getBannerItemListUrl({ areaAlias });
    },
  },
});
</script>

<style scoped lang="scss">
.actions-cell {
  button:not(:last-child) {
    margin-right: 0.5rem;
  }
}
</style>
