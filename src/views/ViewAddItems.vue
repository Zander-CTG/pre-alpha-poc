<script setup lang="ts">
import PageHeading from '@/components/PageHeading.vue'
import { appTitle } from '@/shared/constants'
import { uploadIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appTitle} | Add Items` })
</script>

<template>
  <PageHeading :icon="uploadIcon" title="Add Items" />
</template>
