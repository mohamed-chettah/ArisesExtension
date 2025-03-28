<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {Button} from "@/components/ui/button";
import TableWebsite from "@/components/focus/TableWebsite.vue";
import AddWebsite from "@/components/focus/AddWebsite.vue";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import axios from "axios";
import {storage} from "wxt/storage";

const listWebsite = ref([]);
const isLoading = ref(false);
let token = await storage.getItem('local:accessToken')
let isActiveBlocker = ref(!!(await storage.getItem('local:isActiveBlocker')))

onMounted(async () => {
  let storeWebsite = await storage.getItem('local:listWebsite')
  if(!storeWebsite){
    await fetchWebsites();
  }
  else {
    listWebsite.value = storeWebsite
  }
});

const fetchWebsites = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get('http://localhost:5005/api/user-website', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    listWebsite.value = response.data;
    await storage.setItem('local:listWebsite', response.data)
    // store
  } catch (error) {
    console.error('Error fetching websites:', error);
  }
  finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 1000)
  }
};

function arise(){
  isActiveBlocker.value = true
  storage.setItem('local:isActiveBlocker', true)
  chrome.runtime.sendMessage({ action: "launch-blocker" });
}

function stop(){
  isActiveBlocker.value = false
  storage.setItem('local:isActiveBlocker', false)
  chrome.runtime.sendMessage({ action: "stop-blocker" });
}

defineExpose({
  arise
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <h2 class="text-sm">Distraction Blocker</h2>

    <TableWebsite
        :isLoading="isLoading"
        :listWebsite="listWebsite"
        @fetchWebsite="fetchWebsites"
        :isActiveBlocker="isActiveBlocker"
    />

    <Button v-if="isActiveBlocker" @click="stop" class=" bg-secondary/60 rounded-lg hover:bg-secondary/80 bank-gothic ">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE --><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8s-8-3.59-8-8s3.59-8 8-8M9 9v6h6V9"/></svg>
      Stop
    </Button>
    <div v-else class="flex items-center gap-2 w-full">
      <Popover>
        <PopoverTrigger :class="isActiveBlocker ? 'hidden' : 'block'">
          <Button class="bg-secondary/60 rounded-lg hover:bg-secondary/80 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE --><path fill="currentColor" d="M17 14h2v3h3v2h-3v3h-2v-3h-3v-2h3zm3-2c0-3.36-2.07-6.23-5-7.41V5c0 1.1-.9 2-2 2h-2v2c0 .55-.45 1-1 1H8v2h6c.5 0 .9.35 1 .81c-1.8 1.04-3 2.98-3 5.19c0 1.5.54 2.85 1.44 3.9L12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10l-.1 1.44c-.56-.48-1.2-.85-1.9-1.1zm-9 7.93V18c-1.1 0-2-.9-2-2v-1l-4.79-4.79C4.08 10.78 4 11.38 4 12c0 4.08 3.06 7.44 7 7.93"/></svg> </Button>
        </PopoverTrigger>

        <PopoverContent class="w-52 ml-32 bg-dark-blue text-white rounded-xl border-[0.5px] border-secondary shadow-2xl">
          <AddWebsite
              :isLoading="isLoading"
              @fetchWebsite="fetchWebsites"
              @arise="arise"
          />
        </PopoverContent>
      </Popover>

      <Button @click="arise" class=" bg-secondary rounded-lg hover:bg-secondary/80 bank-gothic w-full text-[16px] ">
        <svg class="text-white" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path  fill="currentColor" d="m9 4l2.5 5.5L17 12l-5.5 2.5L9 20l-2.5-5.5L1 12l5.5-2.5zm0 4.83L8 11l-2.17 1L8 13l1 2.17L10 13l2.17-1L10 11zM19 9l-1.26-2.74L15 5l2.74-1.25L19 1l1.25 2.75L23 5l-2.75 1.26zm0 14l-1.26-2.74L15 19l2.74-1.25L19 15l1.25 2.75L23 19l-2.75 1.26z"/></svg>
        Arise
      </Button>
    </div>


  </div>
</template>

<style scoped>
</style>