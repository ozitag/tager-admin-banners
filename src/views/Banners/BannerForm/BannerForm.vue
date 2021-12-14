<template>
  <page
      :title="
      isCreation ? $t('banners:createBanner') : $t('banners:updateBanner')
    "
      :is-content-loading="isContentLoading"
  >
    <template v-slot:content>
      <form novalidate @submit.prevent="submitForm">
        <div class="zone">
          <form-field-select
              v-model="values.bannerZone"
              name="bannerZone"
              :label="$t('banners:zone')"
              :options="zonesOptionList"
              :error="errors.bannerZone"
          />

          <form-field
              v-model="values.priority"
              name="priority"
              :label="$t('banners:priority')"
              :error="errors.priority"
          />
        </div>

        <input-label>{{ $t('banners:period') }}</input-label>

        <div class="date">
          <form-field
              v-model="values.dateStart"
              :label="$t('banners:from')"
              name="dateStart"
              type="date"
              :max="values.dateEnd"
          />

          <form-field
              v-model="values.dateEnd"
              :label="$t('banners:to')"
              name="dateEnd"
              type="date"
              :min="values.dateStart"
          />
        </div>

        <form-field-checkbox
            v-model="values.disabled"
            name="disabled"
            :label="$t('banners:disabled')"
            :error="errors.disabled"
        />

        <div class="link">
          <form-field
              v-model="values.link"
              name="link"
              :label="$t('banners:link')"
              :error="errors.name"
          />

          <form-field-checkbox
              v-model="values.openNewTab"
              name="openNewTab"
              :label="$t('banners:openNewTab')"
              :error="errors.openNewTab"
          />
        </div>

        <form-field-file-input
            v-model="values.image"
            name="image"
            file-type="image"
            :label="$t('banners:image')"
            :error="errors.file"
        />

        <form-field
            v-model="values.comment"
            name="comment"
            type="textarea"
            :label="$t('banners:comment')"
            :error="errors.comment"
        />
      </form>
    </template>

    <template v-slot:footer>
      <FormFooter
          :back-href="bannerListUrl"
          :on-submit="submitForm"
          :is-submitting="isSubmitting"
          :is-creation="isCreation"
          :can-create-another="isCreation"
      />
    </template>
  </page>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  SetupContext,
  watch,
} from '@vue/composition-api';

import {FormFooter, OptionType, TagerFormSubmitEvent} from '@tager/admin-ui';
import {convertRequestErrorToMap} from '@tager/admin-services';

import {useFetchZones} from '../../../hooks';
import {BannerFormValues} from '../../../typings/banners';
import {useFetchBanner} from '../../../hooks/useFetchBanner';
import {
  getBannersBannerFormUrl,
  getBannersBannerListUrl,
} from '../../../constants/paths';
import {createBanner, updateBanner} from '../../../services/requests';

import {
  convertBannerFormValuesToPayload,
  convertBannerToFormValues,
} from './BannerForm.helpers';

export default defineComponent({
  name: 'BannerForm',
  components: {FormFooter},
  setup(props, context: SetupContext) {
    const bannerId = computed<string>(
        () => context.root.$route.params.bannerId
    );
    const isCreation = computed<boolean>(() => bannerId.value === 'create');

    /** Zones **/

    const {data: zones, loading: isZonesLoading} = useFetchZones({context});

    const zonesOptionList = computed<OptionType[]>(() =>
        zones.value.map<OptionType>((zone) => ({
          value: zone.id,
          label: zone.name,
        }))
    );

    /** Banner **/

    const {data: banner, loading: isBannerLoading} = useFetchBanner({
      context,
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

    const submitForm = (event: TagerFormSubmitEvent) => {
      isSubmitting.value = true;

      const body = convertBannerFormValuesToPayload(values.value);

      const requestPromise = isCreation.value
          ? createBanner(body)
          : updateBanner(bannerId.value, body);

      requestPromise
          .then(({data}) => {
            errors.value = {};

            if (event.type === 'create') {
              context.root.$router.push(
                  getBannersBannerFormUrl({bannerId: String(data.id)})
              );
            }

            if (event.type === 'create_exit' || event.type === 'save_exit') {
              context.root.$router.push(getBannersBannerListUrl());
            }

            if (event.type === 'create_create-another') {
              values.value = convertBannerToFormValues(
                  null,
                  zonesOptionList.value
              );
            }

            context.root.$toast({
              variant: 'success',
              title: context.root.$t('banners:success'),
              body: isCreation.value
                  ? context.root.$t('banners:bannerWasSuccessfullyCreated')
                  : context.root.$t('banners:bannerWasSuccessfullyUpdated'),
            });
          })
          .catch((error) => {
            console.error(error);
            errors.value = convertRequestErrorToMap(error);
            context.root.$toast({
              variant: 'danger',
              title: context.root.$t('banners:error'),
              body: isCreation.value
                  ? context.root.$t('banners:bannerCreationWasFailed')
                  : context.root.$t('banners:bannerUpdateWasFailed'),
            });
          })
          .finally(() => {
            isSubmitting.value = false;
          });
    };

    const isContentLoading = computed<boolean>(
        () => isBannerLoading.value || isZonesLoading.value
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
