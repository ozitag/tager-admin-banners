<template>
  <page
    :title="isCreation ? 'Create Banner Area' : 'Update Banner Area'"
    :is-content-loading="isContentLoading"
    :footer="{ onSubmit: submitForm, backHref: getAreaListUrl() }"
  >
    <template v-slot:content>
      <form novalidate @submit.prevent="submitForm">
        <form-field
          v-model="values.alias"
          name="alias"
          label="Alias"
          :error="errors.alias"
        />

        <form-field
          v-model="values.label"
          name="label"
          label="Label"
          :error="errors.label"
        />

        <form-field
          v-model="values.scenario"
          name="scenario"
          label="Scenario"
          :error="errors.scenario"
        />
      </form>
    </template>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';
import { convertRequestErrorToMap } from '@tager/admin-services';

import {
  BannerAreaCreatePayload,
  createBannerArea,
  getBannerAreaById,
  updateBannerArea,
} from '../services/requests';
import { BannerArea } from '../typings/model';
import { getBannerAreaListUrl } from '../constants/paths';

type FormValues = {
  alias: string;
  label: string;
  scenario: string;
};

const initialValues: FormValues = {
  alias: '',
  label: '',
  scenario: '',
};

export default Vue.extend({
  name: 'BannerAreaForm',
  data(): {
    values: FormValues;
    errors: Record<string, string>;
    isContentLoading: boolean;
  } {
    return {
      values: { ...initialValues },
      errors: {},
      isContentLoading: false,
    };
  },
  computed: {
    areaId(): string {
      return this.$route.params.areaId;
    },
    isCreation(): boolean {
      return this.areaId === 'create';
    },
  },
  watch: {
    areaId() {
      this.updateValues();
    },
  },
  mounted(): void {
    this.updateValues();
  },
  methods: {
    convertReviewToInitialValues(bannerArea: BannerArea): FormValues {
      return {
        alias: bannerArea.alias,
        label: bannerArea.label,
        scenario: bannerArea.scenario,
      };
    },
    updateValues() {
      if (this.isCreation) {
        this.values = { ...initialValues };
      } else {
        this.isContentLoading = true;

        getBannerAreaById(this.areaId)
          .then((response) => {
            this.values = this.convertReviewToInitialValues(response.data);
          })
          .catch(console.error)
          .finally(() => {
            this.isContentLoading = false;
          });
      }
    },
    submitForm() {
      const body: BannerAreaCreatePayload = {
        label: this.values.label,
        alias: this.values.alias,
        scenario: this.values.scenario,
      };

      const requestPromise = this.isCreation
        ? createBannerArea(body)
        : updateBannerArea(this.areaId, body);

      requestPromise
        .then(() => {
          this.errors = {};
          this.$router.push(getBannerAreaListUrl());

          this.$toast({
            variant: 'success',
            title: 'Success',
            body: `Banner Area was successfully ${
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
            body: `Blog bannerArea ${
              this.isCreation ? 'creation' : 'update'
            } was failed`,
          });
        });
    },
    getAreaListUrl: getBannerAreaListUrl,
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
