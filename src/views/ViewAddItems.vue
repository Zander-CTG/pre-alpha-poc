<script setup lang="ts">
import PageHeading from '@/components/PageHeading.vue'
import useLogger from '@/composables/useLogger'
import { appTitle } from '@/shared/constants'
import { uploadIcon } from '@/shared/icons'
import { useBackendStore } from '@/stores/backend'
import { useMeta } from 'quasar'

useMeta({ title: `${appTitle} | Add Items` })

const { log } = useLogger()
const backendStore = useBackendStore()
// const settingsStore = useSettingsStore()

async function onHello() {
  try {
    if (!backendStore.supabase) {
      log.error('Supabase client is not initialized')
      return
    }

    const {
      data: { session },
      error: sessionError,
    } = await backendStore.supabase.auth.getSession()

    if (sessionError || !session) {
      log.error('No user session found', { sessionError })
      return
    }

    const { data, error } = await backendStore.supabase.functions.invoke('hello-world', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
      }),
    })

    log.info('Edge function called', { data, error })
  } catch (error) {
    log.error('Error in onHello:', error as Error)
  }
}
</script>

<template>
  <PageHeading :icon="uploadIcon" title="Add Items" />

  <q-list padding>
    <q-item>
      <q-item-section top>
        <q-item-label>Edge Functions</q-item-label>
        <q-btn label="Hello" color="primary" @click="onHello()" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
