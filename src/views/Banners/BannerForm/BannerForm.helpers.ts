import { OptionType } from '@tager/admin-ui';
import { createId, Nullable } from '@tager/admin-services';

import {
  Banner,
  BannerFormValues,
  BannerPayload,
} from '../../../typings/banners';

export function convertBannerToFormValues(
  banner: Nullable<Banner>,
  zonesOptionList: OptionType[]
): BannerFormValues {
  const foundZone = zonesOptionList.find(
    ({ value }) => value === banner?.bannerZone
  );

  return {
    priority: banner?.priority ?? 1,
    link: banner?.link ?? '',
    image: banner?.image ? { id: createId(), file: banner.image } : null,
    bannerZone: foundZone ?? null,
    openNewTab: banner?.openNewTab ?? false,
    dateStart: banner?.dateStart ?? '',
    dateEnd: banner?.dateEnd ?? '',
    disabled: banner?.disabled ?? false,
    comment: banner?.comment ?? '',
  };
}

export function convertBannerFormValuesToPayload(
  values: BannerFormValues
): BannerPayload {
  return {
    ...values,
    priority: values.priority ? Number(values.priority) : 1,
    dateStart: values.dateStart ? values.dateStart : null,
    dateEnd: values.dateEnd ? values.dateEnd : null,
    image: values.image?.file.id ?? null,
    bannerZone: values.bannerZone?.value ?? '',
  };
}
