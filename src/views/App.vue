<template>
  <page-layout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </page-layout>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';

import { getBannersMenuItem } from '../constants/menu';

export default defineComponent({
  name: 'App',
  setup(props, context: SetupContext) {
    const menu = getBannersMenuItem({ t: context.root.$t });

    return {
      sidebarMenuList: [menu],
    };
  },
});
</script>
