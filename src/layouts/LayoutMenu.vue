<script setup lang="ts">
import { RouteNameEnum } from '@/shared/enums'
import { searchIcon, settingsIcon, uploadIcon } from '@/shared/icons'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import PageResponsiveRouterView from './base/PageResponsiveRouterView.vue'

const $q = useQuasar()
const isDesktop = computed(() => $q.screen.gt.xs)
</script>

<template>
  <q-layout view="hHh lpr lfr">
    <q-header bordered>
      <q-tabs class="text-caption" active-color="yellow" outside-arrows mobile-arrows>
        <q-route-tab no-caps :icon="searchIcon" exact :to="{ name: RouteNameEnum.SEARCH }">
          <template v-if="isDesktop">Search</template>
        </q-route-tab>

        <q-route-tab no-caps :icon="uploadIcon" exact :to="{ name: RouteNameEnum.ADD_ITEMS }">
          <template v-if="isDesktop">Add Items</template>
        </q-route-tab>

        <q-route-tab no-caps :icon="settingsIcon" exact :to="{ name: RouteNameEnum.SETTINGS }">
          <template v-if="isDesktop">Settings</template>
        </q-route-tab>
      </q-tabs>
    </q-header>

    <PageResponsiveRouterView />
  </q-layout>
</template>
