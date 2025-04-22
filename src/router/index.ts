import LayoutMenu from '@/layouts/LayoutMenu.vue'
import { RouteNameEnum } from '@/shared/enums'
import ViewAddItems from '@/views/ViewAddItems.vue'
import ViewSearch from '@/views/ViewSearch.vue'
import ViewSettings from '@/views/ViewSettings.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/search',
      component: LayoutMenu,
      children: [
        {
          path: '/search',
          name: RouteNameEnum.SEARCH,
          component: ViewSearch,
        },
        {
          path: '/add-items',
          name: RouteNameEnum.ADD_ITEMS,
          component: ViewAddItems,
        },
        {
          path: '/settings',
          name: RouteNameEnum.SETTINGS,
          component: ViewSettings,
        },
        {
          path: '/:pathMatch(.*)*', // 404 Not Found. Part of default route path.
          name: RouteNameEnum.NOT_FOUND,
          component: () => import('@/views/ViewNotFound.vue'),
        },
      ],
    },
    // Fullscreen tables cannot use layouts
    {
      path: '/settings-table',
      name: RouteNameEnum.SETTINGS_TABLE,
      component: () => import('@/views/ViewTableSettings.vue'),
    },
    {
      path: '/logs-table',
      name: RouteNameEnum.LOGS_TABLE,
      component: () => import('@/views/ViewTableLogs.vue'),
    },
  ],
})

export default router
