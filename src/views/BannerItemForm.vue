<template>
  <page
    :title="isCreation ? 'Create Banner Item' : 'Update Banner Item'"
    :is-content-loading="isContentLoading"
    :footer="{ onSubmit: submitForm }"
  >
    <template v-slot:content>
      <form novalidate @submit.prevent>
        <form-field
          v-model="values.title"
          name="title"
          label="Title"
          :error="errors.title"
        />

        <form-field
          v-model="values.text"
          name="text"
          label="Text"
          type="textarea"
          :error="errors.text"
          rows="4"
        />

        <form-field-file-input
          v-model="values.image"
          label="Image"
          name="image"
          file-type="image"
        />

        <form-field
          v-model="values.buttonLabel"
          name="buttonLabel"
          label="Button: Label"
          :error="errors.buttonLabel"
        />

        <form-field
          v-model="values.buttonLink"
          name="buttonLink"
          label="Button: Link"
          :error="errors.buttonLink"
        />

        <form-field-checkbox
          v-model="values.buttonIsNewTab"
          name="buttonIsNewTab"
          label="Button: Is new tab?"
          :error="errors.buttonIsNewTab"
        />
      </form>
    </template>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  convertRequestErrorToMap,
  FileType,
  Nullable,
} from '@tager/admin-services';

import {
  BannerItemCreatePayload,
  createBannerItem,
  getBannerAreaByAlias,
  getBannerItemById,
  updateBannerItem,
} from '../services/requests';
import { BannerArea, BannerItem } from '../typings/model';
import { compile } from 'path-to-regexp';
import { BANNER_ROUTE_PATHS } from '..';

function getBannerItemListUrl(areaAlias: string | number): string {
  return compile(BANNER_ROUTE_PATHS.ITEM_LIST)({
    areaAlias,
  });
}

type FormValues = {
  title: string;
  text: string;
  buttonLink: string;
  buttonLabel: string;
  buttonIsNewTab: boolean;
  image: Nullable<FileType>;
};

const INITIAL_VALUES: FormValues = {
  title: '',
  text: '',
  buttonLink: '',
  buttonLabel: '',
  buttonIsNewTab: false,
  image: null,
};

export default Vue.extend({
  name: 'BannerItemForm',
  data(): {
    values: FormValues;
    errors: Record<string, string>;
    isContentLoading: boolean;
    bannerArea: Nullable<BannerArea>;
  } {
    return {
      values: { ...INITIAL_VALUES },
      errors: {},
      isContentLoading: false,
      bannerArea: null,
    };
  },
  computed: {
    itemId(): string {
      return this.$route.params.itemId;
    },
    areaAlias(): string {
      return this.$route.params.areaAlias;
    },
    isCreation(): boolean {
      return this.itemId === 'create';
    },
  },
  watch: {
    itemId() {
      this.updateValues();
    },
    areaAlias() {
      this.updateValues();
    },
  },
  mounted(): void {
    this.updateValues();
  },
  methods: {
    updateValues(): void {
      this.isContentLoading = true;

      Promise.all([
        getBannerAreaByAlias(this.areaAlias)
          .then((response) => {
            this.bannerArea = response.data;
          })
          .catch(console.error),
        this.isCreation
          ? new Promise((resolve) => {
              this.values = { ...INITIAL_VALUES };
              resolve();
            })
          : getBannerItemById(this.itemId)
              .then((response) => {
                this.values = this.convertReviewToInitialValues(response.data);
              })
              .catch(console.error),
      ]).finally(() => {
        this.isContentLoading = false;
      });
    },
    convertReviewToInitialValues(bannerItem: BannerItem): FormValues {
      return {
        title: bannerItem.title,
        text: bannerItem.text,
        buttonLink: bannerItem.buttonLink ?? '',
        buttonLabel: bannerItem.buttonLabel,
        buttonIsNewTab: bannerItem.buttonIsNewTab,
        image: bannerItem.image,
      };
    },
    submitForm() {
      const creationBody: BannerItemCreatePayload = {
        title: this.values.title,
        text: this.values.text,
        buttonLink: this.values.buttonLink.trim() || null,
        buttonLabel: this.values.buttonLabel,
        buttonIsNewTab: this.values.buttonIsNewTab,
        image: this.values.image?.id ?? null,
      };

      const requestPromise = this.isCreation
        ? createBannerItem(this.bannerArea?.id ?? 'unknown', creationBody)
        : updateBannerItem(this.itemId, creationBody);

      requestPromise
        .then(() => {
          this.errors = {};
          this.$router.push(
            getBannerItemListUrl(this.bannerArea?.alias ?? 'unknown')
          );

          this.$toast({
            variant: 'success',
            title: 'Success',
            body: `Banner item has been successfully ${
              this.isCreation ? 'created' : 'updated'
            }`,
          });
        })
        .catch((error) => {
          console.error(error);
          this.errors = convertRequestErrorToMap(error);
          this.$toast({
            variant: 'danger',
            title: 'Error',
            body: `Banner item ${
              this.isCreation ? 'creation' : 'update'
            } has been failed`,
          });
        });
    },
  },
});
</script>

<style scoped lang="scss">
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.save-button {
  min-width: 100px;
}

.alias-field-inner {
  display: flex;
  align-items: center;

  span {
    font-size: 0.9em;
    margin-right: 10px;
  }
}
</style>
