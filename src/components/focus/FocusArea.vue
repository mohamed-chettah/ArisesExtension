<script setup lang="ts">

import Pomodoro from "@/components/focus/Pomodoro.vue";
import BlockerWebsite from "@/components/focus/BlockerWebsite.vue";
</script>

<template>

  <div class="grid grid-cols-12 gap-5">
    <Pomodoro class="col-span-6" />
    <BlockerWebsite class="col-span-6"/>
  </div>

</template>

<style scoped>

</style>