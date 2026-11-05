import { type TFunction } from 'i18next';

import { type ColumnDefinition } from '@tager/admin-ui';

import { type Zone } from '../../../typings/zones';
import { getBannersBannerListUrl } from '../../../utils/paths';

export function getColumnDefs(t: TFunction): ColumnDefinition<Zone>[] {
  return [
    {
      id: 0,
      name: 'ID',
      field: 'id',
      style: { width: '50px', textAlign: 'center' },
      headStyle: { width: '50px', textAlign: 'center' },
    },
    {
      id: 1,
      name: t('banners:name'),
      field: 'name',
      type: 'name',
    },
    {
      id: 2,
      name: t('banners:banners'),
      field: 'bannersCount',
      style: { whiteSpace: 'nowrap', width: '130px' },
    },
  ];
}

export function getLinkToBannersByZone(zoneId: number): string {
  return `${getBannersBannerListUrl()}?filter[zone]=${zoneId}`;
}
