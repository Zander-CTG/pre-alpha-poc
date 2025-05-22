<script setup lang="ts">
import PageHeading from '@/components/PageHeading.vue'
import useLogger from '@/composables/useLogger'
import { appTitle } from '@/shared/constants'
import { importFileIcon, uploadIcon } from '@/shared/icons'
import { useBackendStore } from '@/stores/backend'
import { useMeta } from 'quasar'
import { ref } from 'vue'

useMeta({ title: `${appTitle} | Add Items` })

const { log } = useLogger()
const backendStore = useBackendStore()

const image = ref<File | null>(null)

/**
 * Handles rejected files during import and logs a warning.
 */
function onRejectedFile(entries: any) {
  const name = entries?.[0]?.file?.name
  const size = entries?.[0]?.file?.size
  const type = entries?.[0]?.file?.type
  log.warn(`Cannot import ${name}`, { name, size, type })
  image.value = null! // Clear input
}

async function onGetItems() {
  try {
    if (!backendStore.supabase) {
      log.error('Supabase client is not initialized')
      return
    }

    const { data, error } = await backendStore.supabase.functions.invoke('api-private-get-items')

    log.info('Edge function called', { data, error })
  } catch (error) {
    log.error('Error in onGetItems:', error as Error)
  }
}

async function onUploadImage() {
  try {
    if (!backendStore.supabase) {
      log.error('Supabase client is not initialized')
      return
    }

    if (!image.value) {
      log.error('No image selected for upload')
      return
    }

    // Prepare the form data
    const formData = new FormData()
    formData.append('file', image.value)

    const { data, error } = await backendStore.supabase.functions.invoke(
      'api-private-upload-image',
      {
        body: formData,
      },
    )

    log.info('Edge function called', { data, error })
  } catch (error) {
    log.error('Error in onUploadImage:', error as Error)
  }
}
</script>

<template>
  <PageHeading :icon="uploadIcon" title="Add Items" />

  <q-list padding>
    <q-item>
      <q-item-section top>
        <q-item-label>Edge Functions</q-item-label>
        <q-btn label="Get Items" color="primary" @click="onGetItems()" />
        <q-file
          v-model="image"
          :disable="$q.loading.isActive"
          label="Image File"
          clearable
          dense
          outlined
          accept="image/jpg,image/jpeg,image/png"
          @rejected="onRejectedFile"
        >
          <template v-slot:before>
            <q-btn
              :disable="!image || $q.loading.isActive"
              :icon="importFileIcon"
              color="primary"
              @click="onUploadImage()"
            />
          </template>
        </q-file>
      </q-item-section>
    </q-item>
  </q-list>
</template>
