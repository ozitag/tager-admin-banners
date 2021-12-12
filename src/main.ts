import { i18n } from '@tager/admin-services';

import EN from './locales/en';
import RU from './locales/ru';

i18n.addTranslations('en', 'blog', EN);
i18n.addTranslations('ru', 'blog', RU);

export * from './constants/routes';
export * from './constants/menu';
export * from './constants/paths';
export * from './services/requests';
