<script setup lang="ts">
const { $client } = useNuxtApp()
// const hello = await $client.unstructured.hello.useLazyQuery()
</script>

<template>
  <div>
    <!-- {{ hello }} -->
    <NuxtRouteAnnouncer />
    
  </div>
  <NuxtPage />
</template>
