<script setup lang="ts">

import api from '../../lib/api'

const emit = defineEmits(['fetchWebsite'])

type Website = {
  id: number;
  website : {
    id: number;
    favicon: string;
    website_name: string;
    active: boolean;
  }
}

defineProps<{
  listWebsite: Website[]
}>();

let token = await storage.getItem('local:accessToken')
async function deleteItem(item : Website){
  console.log('deleteItem')
  console.log(item)
  if(confirm('Are you sure you want to delete this item?')){
    try {
      await api.delete('http://localhost:5005/api/user-website/' + item.id, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // emit
      emit('fetchWebsite')
    } catch (error) {
      console.error('Error fetching websites:', error);
    }
  }
}

</script>

<template>
  <div class="rounded-lg p-2 w-fit bg-black border-[0.5px] border-secondary shadow-2xl">
    <table class="text-white table-fixed w-full border-collapse">
      <tbody>
      <tr
          v-for="item in listWebsite"
          :key="item.website.id"
          class="border-b border-gray-700"
      >
        <td class="px-4 py-2"><img :src="item.website.favicon" :alt="item.website.website_name"></td>
        <td class="px-1 py-2">{{ item.website.website_name }}</td>
        <td class="px-4 pb-2 pt-4">
          <label class="relative inline-flex items-center cursor-pointer">
              <svg  @click="deleteItem(item)" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#A480F2" d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8m4 6v7a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-7zm-2.5-4l1 1H17v2H7V7h2.5l1-1z"/></svg>
          </label>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Pour la transition de la pastille du toggle */
</style>
