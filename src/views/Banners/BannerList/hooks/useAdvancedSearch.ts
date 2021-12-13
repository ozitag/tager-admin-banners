import {
  computed,
  ComputedRef,
  ref,
  Ref,
  SetupContext,
  watch,
} from '@vue/composition-api';
import { TFunction } from 'i18next';

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
  zoneList: ComputedRef<Zone[]>;
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

export function useAdvancedSearch({ context, t, zoneList }: Params): State {
  /** Zone **/

  const zonesOptionList = computed<OptionType[]>(() =>
    zoneList.value.map(({ id, name }) => ({
      value: id,
      label: name,
    }))
  );

  const initialZoneFilter = computed<OptionType[]>(() => {
    const queryValue = getFilterParamAsStringArray(
      context.root.$route.query,
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
    () =>
      getFilterParamAsString(context.root.$route.query, FilterTypes.Date) ?? ''
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
      context.root.$route.query,
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
