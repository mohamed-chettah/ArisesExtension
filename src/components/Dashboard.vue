<script setup>
import { Button } from '@/components/ui/button'
import { storage } from "wxt/storage"
import {useRouter} from "vue-router";
const router = useRouter();
function logout(){
  storage.removeItem('local:accessToken')
  storage.removeItem('local:user')
  storage.removeItem('local:oauth')

  router.push('/')
}

</script>

<template>
    <div class="bg-red-500">
        test test dashboard

    </div>

  <Button @click="logout">Logout</Button>
</template>

<style scoped>

</style>


