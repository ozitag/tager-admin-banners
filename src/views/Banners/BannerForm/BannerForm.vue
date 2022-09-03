<template>
  <Page
    :title="
      isCreation
        ? $i18n.t('banners:createBanner')
        : $i18n.t('banners:updateBanner')
    "
    :is-content-loading="isContentLoading"
  >
    <template #content>
      <form novalidate @submit.prevent="submitForm">
        <div class="zone">
          <FormFieldSelect
            v-model:value="values.bannerZone"
            name="bannerZone"
            :label="$i18n.t('banners:zone')"
            :options="zonesOptionList"
            :error="errors.bannerZone"
          />

          <FormField
            v-model:value="values.priority"
            name="priority"
            :label="$i18n.t('banners:priority')"
            :error="errors.priority"
          />
        </div>

        <InputLabel>{{ $i18n.t('banners:period') }}</InputLabel>

        <div class="date">
          <FormField
            v-model:value="values.dateStart"
            :label="$i18n.t('banners:from')"
            name="dateStart"
            type="date"
            :max="values.dateEnd"
          />

          <FormField
            v-model:value="values.dateEnd"
            :label="$i18n.t('banners:to')"
            name="dateEnd"
            type="date"
            :min="values.dateStart"
          />
        </div>

        <FormFieldCheckbox
          v-model:checked="values.disabled"
          name="disabled"
          :label="$i18n.t('banners:disabled')"
          :error="errors.disabled"
        />

        <div class="link">
          <FormField
            v-model:value="values.link"
            name="link"
            :label="$i18n.t('banners:link')"
            :error="errors.name"
          />

          <FormFieldCheckbox
            v-model:checked="values.openNewTab"
            name="openNewTab"
            :label="$i18n.t('banners:openNewTab')"
            :error="errors.openNewTab"
          />
        </div>

        <FormFieldFileInput
          v-model:value="values.image"
          name="image"
          file-type="image"
          :label="$i18n.t('banners:image')"
          :error="errors.file"
        />

        <DynamicField
          v-for="field of values.fields"
          :key="field.name"
          :field="field"
        />

        <FormField
          v-model:value="values.comment"
          name="comment"
          type="textarea"
          :label="$i18n.t('banners:comment')"
          :error="errors.comment"
        />
      </form>
    </template>

    <template #footer>
      <FormFooter
        :back-href="bannerListUrl"
        :is-submitting="isSubmitting"
        :is-creation="isCreation"
        :can-create-another="isCreation"
        @submit="submitForm"
      />
    </template>
  </Page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, SetupContext, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  FormField,
  FormFieldCheckbox,
  FormFieldFileInput,
  FormFieldSelect,
  FormFooter,
  InputLabel,
  OptionType,
  TagerFormSubmitEvent,
} from '@tager/admin-ui';
import { DynamicField, universalFieldUtils } from '@tager/admin-dynamic-field';
import {
  convertRequestErrorToMap,
  navigateBack,
  useI18n,
  useToast,
} from '@tager/admin-services';
import { Page } from '@tager/admin-layout';

import { useFetchZones } from '../../../hooks';
import { BannerFormValues } from '../../../typings/banners';
import { useFetchBanner } from '../../../hooks/useFetchBanner';
import {
  getBannersBannerFormUrl,
  getBannersBannerListUrl,
} from '../../../utils/paths';
import { createBanner, updateBanner } from '../../../services/requests';
import { useFetchZoneFields } from '../../../hooks/useFetchZoneFields';

import {
  convertBannerFormValuesToPayload,
  convertBannerToFormValues,
} from './BannerForm.helpers';

export default defineComponent({
  name: 'BannerForm',
  components: {
    FormFieldFileInput,
    FormFieldCheckbox,
    InputLabel,
    FormField,
    FormFieldSelect,
    Page,
    FormFooter,
    DynamicField,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const { t } = useI18n();

    const bannerId = computed<string>(() => route.params.bannerId as string);
    const isCreation = computed<boolean>(() => bannerId.value === 'create');

    /** Zones **/

    const { data: zones, loading: isZonesLoading } = useFetchZones();

    const zonesOptionList = computed<OptionType[]>(() =>
      zones.value.map<OptionType>((zone) => ({
        value: zone.id,
        label: zone.name,
      }))
    );

    /** Banner **/

    const { data: banner, loading: isBannerLoading } = useFetchBanner({
      bannerId,
      isCreation,
    });

    /** Form State **/

    const isSubmitting = ref<boolean>(false);
    const values = ref<BannerFormValues>(
      convertBannerToFormValues(banner.value, zonesOptionList.value)
    );
    const errors = ref<Record<string, string>>({});

    watch([banner, zones], () => {
      values.value = convertBannerToFormValues(
        banner.value,
        zonesOptionList.value
      );
    });

    /** Zone Fields **/

    const { loading: isZoneFieldsLoading, data: zoneFields } =
      useFetchZoneFields({ values });

    watch(zoneFields, () => {
      values.value.fields = (zoneFields.value?.fields ?? []).map(
        (fieldConfig, index) =>
          universalFieldUtils.createFormField(
            fieldConfig,
            banner.value ? banner.value.fields[index].value ?? null : null
          )
      );
    });

    const submitForm = (event: TagerFormSubmitEvent) => {
      isSubmitting.value = true;

      const body = convertBannerFormValuesToPayload(values.value);

      const requestPromise = isCreation.value
        ? createBanner(body)
        : updateBanner(bannerId.value, body);

      requestPromise
        .then(({ data }) => {
          errors.value = {};

          if (event.type === 'create') {
            router.push(getBannersBannerFormUrl({ bannerId: String(data.id) }));
          } else if (
            event.type === 'create_exit' ||
            event.type === 'save_exit'
          ) {
            navigateBack(router, getBannersBannerListUrl());
          } else if (event.type === 'create_create-another') {
            values.value = convertBannerToFormValues(
              null,
              zonesOptionList.value
            );
          }

          toast.show({
            variant: 'success',
            title: t('banners:success'),
            body: isCreation.value
              ? t('banners:bannerWasSuccessfullyCreated')
              : t('banners:bannerWasSuccessfullyUpdated'),
          });
        })
        .catch((error) => {
          console.error(error);
          errors.value = convertRequestErrorToMap(error);
          toast.show({
            variant: 'danger',
            title: t('banners:error'),
            body: isCreation.value
              ? t('banners:bannerCreationWasFailed')
              : t('banners:bannerUpdateWasFailed'),
          });
        })
        .finally(() => {
          isSubmitting.value = false;
        });
    };

    const isContentLoading = computed<boolean>(
      () =>
        isBannerLoading.value ||
        isZonesLoading.value ||
        isZoneFieldsLoading.value
    );

    return {
      isCreation,
      isContentLoading,
      isSubmitting,
      values,
      errors,
      submitForm,
      bannerListUrl: getBannersBannerListUrl(),
      zonesOptionList,
    };
  },
});
</script>

<style lang="scss">
.date {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 10px;
}

.zone {
  display: flex;

  > *:first-child {
    flex: 1 1 1px;
  }

  > *:last-child {
    flex-basis: 30%;
    margin-left: 20px;
  }
}

.link {
  display: flex;
  align-items: flex-end;

  > *:first-child {
    flex: 1 1 1px;
  }

  > *:last-child {
    flex-basis: 30%;
    margin-left: 20px;
    padding-bottom: 8px;
  }
}
</style>
