import { initializeEnvironment } from '@tager/admin-services';

export function populateEnvironment() {
  initializeEnvironment({
    publicPath: import.meta.env.VUE_APP_PUBLIC_PATH,
    appEnv: import.meta.env.VUE_APP_ENV,
    apiUrl: import.meta.env.VUE_APP_API_URL,
    accessToken: import.meta.env.VUE_APP_ACCESS_TOKEN,
    websiteUrl: import.meta.env.VUE_APP_WEBSITE_URL,
    websiteButtonUrl: import.meta.env.VUE_APP_WEBSITE_BUTTON_URL,
    sentryDsn: import.meta.env.VUE_APP_SENTRY_DSN,
    sentryEnv: import.meta.env.VUE_APP_SENTRY_ENVIRONMENT,
    baseUrl: import.meta.env.BASE_URL,
    nodeEnv: import.meta.env.MODE,
    version: import.meta.env.VUE_APP_VERSION,
  });
}
