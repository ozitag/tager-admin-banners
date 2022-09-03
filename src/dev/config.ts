import type { AppConfigType } from '@tager/admin-services';

export const OZITAG_CONFIG: AppConfigType = {
  APP_NAME: 'OZiTAG_ADMIN',
  TITLE_TEMPLATE: 'OZiTAG Admin - {{title}}',
  LANGUAGE: 'EN',
  BRAND: {
    small: {
      logo: 'logo-small.svg',
    },
    large: {
      logo: 'logo.svg',
      label: 'OZiTAG',
      'label-color': '#DD6900',
    },
    subtitle: '',
  },
  SPLASH_SCREEN: {
    enabled: true,
    logo: 'logo-white.svg',
    background: '#1e1e1e',
  },
};
