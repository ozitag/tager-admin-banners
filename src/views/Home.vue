<template>
  <navigation-grid :nav-items="navItemList" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

import { NavigationGridItem } from '@tager/admin-ui';

import {
  getBannersZoneListUrl,
  getBannersBannerListUrl,
} from '../constants/paths';

export default defineComponent({
  name: 'Home',
  setup(props, context) {
    const navItemList = ref<NavigationGridItem[]>([
      {
        name: context.root.$t('banners:banners'),
        linkList: [
          {
            url: getBannersZoneListUrl(),
            text: context.root.$t('banners:zones'),
          },
          {
            url: getBannersBannerListUrl(),
            text: context.root.$t('banners:banners'),
          },
        ],
      },
    ]);

    return { navItemList };
  },
});
</script>
