<template>
  <page
    title="Banner Items"
    :header-buttons="[
      { text: 'New Banner Item', href: getLinkToBannerItemForm('create') },
    ]"
  >
    <template v-slot:content>
      <base-table
        :column-defs="columnDefs"
        :row-data="rowData"
        :loading="isRowDataLoading"
        :error-message="errorMessage"
      >
        <template v-slot:cell(actions)="{ row, rowIndex }">
          <base-button
            variant="icon"
            title="Edit"
            :disabled="deletingBannerItemIdList.includes(row.id)"
            :href="getLinkToBannerItemForm(row.id)"
          >
            <svg-icon name="edit"></svg-icon>
          </base-button>

          <base-button
            variant="icon"
            title="Move up"
            :disabled="rowIndex === 0 || isBannerItemMoving"
            @click="moveBannerItem(row.id, 'up')"
          >
            <svg-icon name="north"></svg-icon>
          </base-button>

          <base-button
            variant="icon"
            title="Move down"
            :disabled="rowIndex === rowData.length - 1 || isBannerItemMoving"
            @click="moveBannerItem(row.id, 'down')"
          >
            <svg-icon name="south"></svg-icon>
          </base-button>

          <base-button
            variant="icon"
            title="Remove"
            :disabled="deletingBannerItemIdList.includes(row.id)"
            @click="handleBannerItemDelete(row)"
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
import { compile } from 'path-to-regexp';
import { getMessageFromError, Nullable } from '@tager/admin-services';
import { BannerArea, BannerItem } from '../typings/model';
import {
  deleteBannerItem,
  getBannerAreaByAlias,
  getBannerItemList,
  moveBannerItem,
} from '../services/requests';
import { BANNER_ROUTE_PATHS } from '../constants/paths';

function getBannerItemUrl(itemId: string | number, areaAlias: string): string {
  return compile(BANNER_ROUTE_PATHS.ITEM_FORM)({
    areaAlias,
    itemId,
  });
}

const COLUMN_DEFS: Array<ColumnDefinition<BannerItem>> = [
  {
    id: 1,
    name: 'ID',
    field: 'id',
    style: { width: '50px', textAlign: 'center' },
    headStyle: { width: '50px', textAlign: 'center' },
  },
  {
    id: 2,
    name: 'Title',
    field: 'title',
  },
  { id: 3, name: 'Text', field: 'text' },
  {
    id: 4,
    name: 'Image',
    field: 'image.url',
    type: 'image',
  },

  { id: 5, name: 'Button: Label', field: 'buttonLabel' },
  { id: 6, name: 'Button: Link', field: 'buttonLink' },
  { id: 7, name: 'Button: Is new tab?', field: 'buttonLink' },
  {
    id: 9,
    name: 'Actions',
    field: 'actions',
    style: { whiteSpace: 'nowrap', width: '205px' },
    headStyle: { whiteSpace: 'nowrap', width: '205px' },
  },
];

export default Vue.extend({
  name: 'BannerItemList',
  data(): {
    columnDefs: Array<ColumnDefinition<BannerItem>>;
    rowData: Array<BannerItem>;
    deletingBannerItemIdList: Array<number>;
    isBannerItemMoving: boolean;
    isRowDataLoading: boolean;
    errorMessage: Nullable<string>;
    bannerArea: Nullable<BannerArea>;
  } {
    return {
      bannerArea: null,
      columnDefs: COLUMN_DEFS,
      rowData: [],
      deletingBannerItemIdList: [],
      isBannerItemMoving: false,
      isRowDataLoading: false,
      errorMessage: null,
    };
  },
  computed: {
    areaAlias(): string {
      return this.$route.params.areaAlias;
    },
  },
  mounted(): void {
    this.refreshBannerItemList();
  },
  methods: {
    refreshBannerItemList(): Promise<void> {
      this.isRowDataLoading = true;
      return getBannerAreaByAlias(this.areaAlias)
        .then((response) => {
          this.bannerArea = response.data;
          return getBannerItemList(this.bannerArea.id);
        })
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
    moveBannerItem(bannerItemId: number, direction: 'up' | 'down') {
      this.isBannerItemMoving = true;

      moveBannerItem(bannerItemId, direction)
        .then((response) => {
          if (response.success) {
            return this.refreshBannerItemList();
          }
        })
        .catch(console.error)
        .finally(() => {
          this.isBannerItemMoving = false;
        });
    },
    handleBannerItemDelete(bannerItem: BannerItem) {
      const shouldDeleteBannerItem = confirm(
        `Are you sure you want to delete banner item "${bannerItem.title}"`
      );

      if (shouldDeleteBannerItem) {
        this.deletingBannerItemIdList.push(bannerItem.id);
        deleteBannerItem(bannerItem.id)
          .then((response) => {
            if (response.success) {
              this.refreshBannerItemList().then(() => {
                this.deletingBannerItemIdList.filter(
                  (id) => id !== bannerItem.id
                );
              });
              this.$toast({
                variant: 'success',
                title: 'Success',
                body: 'Banner Item was successfully removed',
              });
            } else {
              this.$toast({
                variant: 'danger',
                title: 'Error',
                body: 'Banner Item deletion was failed',
              });
            }
          })
          .catch((error) => {
            console.error(error);
            this.$toast({
              variant: 'danger',
              title: 'Error',
              body: 'Banner Item deletion was failed',
            });
          });
      }
    },
    getLinkToBannerItemForm(bannerItemId: number | string) {
      return getBannerItemUrl(
        bannerItemId,
        this.bannerArea?.alias ?? 'unknowm'
      );
    },
  },
});
</script>

<style scoped lang="scss"></style>
