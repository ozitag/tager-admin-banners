import { TFunction } from 'i18next';

import { ColumnDefinition } from '@tager/admin-ui';

import { Banner, Status } from '../../../typings/banners';
import { Zone } from '../../../typings/zones';

export function getStatus(type: Status, t: TFunction) {
  switch (type) {
    case Status.Waiting:
      return t('banners:statuses.waiting');
    case Status.Archived:
      return t('banners:statuses.archived');
    case Status.Active:
      return t('banners:statuses.active');
    case Status.Disabled:
      return t('banners:statuses.disabled');

    default:
      return '';
  }
}

export function getColumnDefs(
  zoneList: Zone[],
  t: TFunction
): ColumnDefinition<Banner>[] {
  return [
    {
      id: 0,
      name: '#',
      field: 'id',
      format: ({ rowIndex }) => String(rowIndex + 1),
      style: { width: '50px', textAlign: 'center' },
      headStyle: { width: '50px', textAlign: 'center' },
    },
    {
      id: 1,
      name: t('banners:zone'),
      field: 'bannerZone',
      format: ({ row }) => {
        const foundBannerZone = zoneList.find(
          (zone) => zone.id === row.bannerZone
        );
        return foundBannerZone
          ? foundBannerZone.name
          : t('banners:bannerZoneIsDeleted');
      },
    },
    {
      id: 2,
      name: t('banners:status'),
      field: 'status',
      format: ({ row }) => getStatus(row.status, t),
      style: { width: '120px' },
      headStyle: { width: '120px' },
    },
    {
      id: 3,
      name: t('banners:priority'),
      field: 'priority',
      style: { width: '100px', textAlign: 'center' },
      headStyle: { width: '100px', textAlign: 'center' },
    },
    {
      id: 4,
      name: t('banners:period'),
      field: 'dateStart',
      format: ({ row }) =>
        `${row.dateStart ? `${t('banners:from')} ${row.dateStart}` : ''} ${
          row.dateEnd ? `${t('banners:to')} ${row.dateEnd}` : ''
        }`,
    },
    {
      id: 5,
      name: t('banners:image'),
      field: 'image',
      type: 'image',
    },
    {
      id: 6,
      name: t('banners:link'),
      field: 'link',
      type: 'name',
      format: ({ row }) => ({
        adminLink: {
          url: row.link ?? '',
          text: row.link ?? '',
        },
        paramList: [
          {
            name: t('banners:newTab'),
            value: row.openNewTab ? t('banners:yes') : t('banners:no'),
          },
        ],
      }),
      options: {
        shouldOpenNewTab: true,
      },
    },
    {
      id: 7,
      name: t('banners:comment'),
      field: 'comment',
    },
    {
      id: 8,
      name: t('banners:actions'),
      field: 'actions',
      style: { whiteSpace: 'nowrap', width: '100px' },
      headStyle: { whiteSpace: 'nowrap', width: '100px' },
    },
  ];
}
