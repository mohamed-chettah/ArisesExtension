<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {Button} from "@/components/ui/button";
import TableWebsite from "@/components/focus/TableWebsite.vue";
import AddWebsite from "@/components/focus/AddWebsite.vue";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import axios from "axios";

const listWebsite = ref([]);
const newWebsite = ref('');
const isLoading = ref(false);
let token = await storage.getItem('local:accessToken')

const fetchWebsites = async () => {
  try {
    const response = await axios.get('http://localhost:5005/api/user-website', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    console.log(response.data)
    listWebsite.value = response.data;
  } catch (error) {
    console.error('Error fetching websites:', error);
  }
};

onMounted(() => {
  fetchWebsites();
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h2 class="text-sm">Distraction Blocker</h2>
      

    </div>
    <Popover>
      <PopoverTrigger>
        <Button class="bg-secondary/60 rounded-lg hover:bg-secondary/80 text-xs">
          <svg class="text-white" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path  fill="currentColor" d="m9 4l2.5 5.5L17 12l-5.5 2.5L9 20l-2.5-5.5L1 12l5.5-2.5zm0 4.83L8 11l-2.17 1L8 13l1 2.17L10 13l2.17-1L10 11zM19 9l-1.26-2.74L15 5l2.74-1.25L19 1l1.25 2.75L23 5l-2.75 1.26zm0 14l-1.26-2.74L15 19l2.74-1.25L19 15l1.25 2.75L23 19l-2.75 1.26z"/></svg>
          Add Website</Button>
      </PopoverTrigger>

      <PopoverContent class="w-52 bg-dark-blue text-white rounded-xl border-[0.5px] border-secondary shadow-2xl">
        <AddWebsite
            :isLoading="isLoading"
            :newWebsite="newWebsite"
        />
      </PopoverContent>
    </Popover>

    <TableWebsite 
      :listWebsite="listWebsite"
    />
  </div>
</template>

<style scoped>
</style>