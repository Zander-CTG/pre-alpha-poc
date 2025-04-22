<script setup lang="ts">
import PageHeading from '@/components/PageHeading.vue'
import { appTitle } from '@/shared/constants'
import { searchIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appTitle} | Search` })
</script>

<template>
  <PageHeading :icon="searchIcon" title="Search" />
</template>
