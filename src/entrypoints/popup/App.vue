<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

const width = computed(() => {
  if(router.currentRoute.value.path === '/'){
    return 'w-[400px]'
  } else {
    return 'w-[500px]'
  }
})
</script>

<template>
  <div class="rounded-lg min-h-[480px] p-5 bg-[url(@/assets/bg-login.png)] bg-cover bg-center border-secondary border-[0.5px]" :class="width" >
    <router-view />
  </div>
</template>

<style scoped></style>

