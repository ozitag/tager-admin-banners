import { computed, ComputedRef, ref, Ref, SetupContext, watch } from 'vue';
import { TFunction } from 'i18next';
import { RouteLocationNormalizedLoaded } from 'vue-router';

import {
  FilterTagType,
  getFilterParamAsString,
  getFilterParamAsStringArray,
  getFilterParams,
  OptionType,
} from '@tager/admin-ui';

import { Zone } from '../../../../typings/zones';
import { Status } from '../../../../typings/banners';
import { getStatus } from '../BannerList.helpers';

interface Params {
  context: SetupContext;
  t: TFunction;
  zoneList: Ref<Zone[]>;
  route: RouteLocationNormalizedLoaded;
}

interface State {
  zoneFilter: Ref<OptionType[]>;
  zonesOptionList: ComputedRef<OptionType[]>;
  dateFilter: Ref<string>;
  statusFilter: Ref<OptionType[]>;
  statusesOptionList: ComputedRef<OptionType[]>;
  filterParams: ComputedRef<Record<string, string | string[]>>;
  tags: ComputedRef<FilterTagType[]>;

  tagRemovalHandler(event: FilterTagType): void;
}

enum FilterTypes {
  Zone = 'zone',
  Date = 'date',
  Status = 'status',
}

export function useAdvancedSearch({
  context,
  t,
  zoneList,
  route,
}: Params): State {
  /** Zone **/

  const zonesOptionList = computed<OptionType[]>(() =>
    zoneList.value.map(({ id, name }) => ({
      value: id,
      label: name,
    }))
  );

  const initialZoneFilter = computed<OptionType[]>(() => {
    const queryValue = getFilterParamAsStringArray(
      route.query,
      FilterTypes.Zone
    );
    return zonesOptionList.value.filter(({ value }) =>
      queryValue.some((selected) => selected === value)
    );
  });

  const zoneFilter = ref<OptionType[]>(initialZoneFilter.value);

  watch(initialZoneFilter, () => {
    zoneFilter.value = initialZoneFilter.value;
  });

  /** Date **/

  const initialDateFilter = computed<string>(
    () => getFilterParamAsString(route.query, FilterTypes.Date) ?? ''
  );

  const dateFilter = ref<string>(initialDateFilter.value);

  watch(initialDateFilter, () => {
    dateFilter.value = initialDateFilter.value;
  });

  /** Status **/

  const statusesOptionList = computed<OptionType[]>(() =>
    Object.entries(Status).map(([_, value]) => ({
      value: value,
      label: getStatus(value, t),
    }))
  );

  const initialStatusFilter = computed<OptionType[]>(() => {
    const queryValue = getFilterParamAsStringArray(
      route.query,
      FilterTypes.Status
    );
    return statusesOptionList.value.filter(({ value }) =>
      queryValue.some((selected) => selected === value)
    );
  });

  const statusFilter = ref<OptionType[]>(initialStatusFilter.value);

  watch(initialStatusFilter, () => {
    statusFilter.value = initialStatusFilter.value;
  });

  /** Params **/

  const filterParams = computed(() =>
    getFilterParams({
      [FilterTypes.Zone]: zoneFilter.value.map(({ value }) => value),
      [FilterTypes.Date]: dateFilter.value || [],
      [FilterTypes.Status]: statusFilter.value.map(({ value }) => value),
    })
  );

  /** Tag removal handler **/

  const tagRemovalHandler = (event: FilterTagType): void => {
    if (event.name === FilterTypes.Zone) {
      zoneFilter.value = zoneFilter.value.filter(
        ({ value }) => value !== event.value
      );
    }
    if (event.name === FilterTypes.Date) {
      dateFilter.value = '';
    }
    if (event.name === FilterTypes.Status) {
      statusFilter.value = statusFilter.value.filter(
        ({ value }) => value !== event.value
      );
    }
  };

  /** Tags **/

  const tags = computed<FilterTagType[]>(() => []);

  return {
    zoneFilter,
    zonesOptionList,
    dateFilter,
    statusFilter,
    statusesOptionList,
    filterParams,
    tags,
    tagRemovalHandler,
  };
}
