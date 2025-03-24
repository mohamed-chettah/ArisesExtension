<script setup lang="ts">

import Pomodoro from "@/components/focus/Pomodoro.vue";
import BlockerWebsite from "@/components/focus/BlockerWebsite.vue";
</script>

<template>

  <h1 class="text-white mb-4 text-lg font-normal">Focus Area</h1>

  <div class="grid grid-cols-12 gap-5">
    <Pomodoro class="card col-span-6" />
    <Suspense>
      <template #default>
        <BlockerWebsite class="card col-span-6" />
      </template>
      <template #fallback>
        <div>Chargement...</div>
      </template>
    </Suspense>
  </div>

</template>

<style scoped>
.card {
  @apply p-5 flex flex-col gap-5 bg-dark-blue/70 text-white rounded-xl border-[0.5px] border-secondary shadow-2xl
}
</style>