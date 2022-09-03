<template>
  <PageLayout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { MenuItemType, PageLayout } from '@tager/admin-layout';
import { ViewListIcon } from '@tager/admin-ui';
import { useI18n } from '@tager/admin-services';

import { getBannersBannerListUrl, getBannersZoneListUrl } from '../utils/paths';

export default defineComponent({
  name: 'App',
  components: {
    PageLayout,
  },
  setup() {
    const i18n = useI18n();

    const sidebarMenuList: Array<MenuItemType> = [
      {
        id: 'banners',
        text: i18n.t('banners:banners'),
        icon: ViewListIcon,
        url: getBannersBannerListUrl(),
      },
      {
        id: 'zones',
        text: i18n.t('banners:zones'),
        icon: ViewListIcon,
        url: getBannersZoneListUrl(),
      },
    ];

    return {
      sidebarMenuList,
    };
  },
});
</script>

<style scoped lang="scss"></style>
