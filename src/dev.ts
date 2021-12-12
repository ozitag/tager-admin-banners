import Vue, { CreateElement } from 'vue';
import VueCompositionApi, { createApp } from '@vue/composition-api';

import { configStore, i18n } from '@tager/admin-services';
import { AdminUiPlugin } from '@tager/admin-ui';
import { AdminLayoutPlugin } from '@tager/admin-layout';

import '@tager/admin-ui/dist/admin-ui.css';

import router from './router';
import config from './config/config.json';
import App from './views/App.vue';
import EN from './locales/en';
import RU from './locales/ru';

configStore.setConfig(config);

i18n.addTranslations('en', 'banners', EN);
i18n.addTranslations('ru', 'banners', RU);

i18n.init({ debug: false }).then(() => {
  Vue.use(VueCompositionApi);

  const app = createApp({
    router,
    render: (h: CreateElement) => h(App),
  });

  app.use(i18n.getPlugin());
  app.use(AdminUiPlugin);
  app.use(AdminLayoutPlugin);

  app.mount('#app');
});
