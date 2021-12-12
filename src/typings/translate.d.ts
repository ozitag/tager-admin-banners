import { TFunction } from 'i18next';

declare module 'vue/types/vue' {
  interface Vue {
    $t: TFunction;
  }
  interface VueConstructor {
    $t: TFunction;
  }
}
