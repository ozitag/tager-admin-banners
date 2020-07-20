<template>
  <page
    :title="pageTitle"
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
        enumerable
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
import { ColumnDefinition, formatBoolean } from '@tager/admin-ui';
import { getMessageFromError, Nullable } from '@tager/admin-services';
import { BannerArea, BannerItem } from '../typings/model';
import {
  deleteBannerItem,
  getBannerAreaByAlias,
  getBannerItemList,
  moveBannerItem,
} from '../services/requests';
import { getBannerItemFormUrl } from '../constants/paths';

const COLUMN_DEFS: Array<ColumnDefinition<BannerItem>> = [
  {
    id: 2,
    name: 'Image',
    field: 'image',
    type: 'image',
  },
  {
    id: 1,
    name: 'Title',
    field: 'title',
  },
  { id: 3, name: 'Text', field: 'text', type: 'html' },
  { id: 4, name: 'Button: Label', field: 'buttonLabel' },
  { id: 5, name: 'Button: Link', field: 'buttonLink' },
  {
    id: 6,
    name: 'Button: Is new tab?',
    field: 'buttonIsNewTab',
    format: ({ row }) => formatBoolean(row.buttonIsNewTab),
  },
  {
    id: 7,
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
    pageTitle(): string {
      return this.bannerArea ? `"${this.bannerArea.label}" banners` : '';
    },
  },
  watch: {
    areaAlias() {
      this.refreshBannerItemList();
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
      return getBannerItemFormUrl({
        areaAlias: this.bannerArea?.alias ?? 'unknowm',
        itemId: bannerItemId,
      });
    },
  },
});
</script>

<style scoped lang="scss"></style>
