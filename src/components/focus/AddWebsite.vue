<script setup lang="ts">
import api from '../../lib/api'
import { ref } from 'vue'
import { storage } from 'wxt/storage'

const title = ref('')
const url = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

let token = await storage.getItem('local:accessToken')
const emit = defineEmits(['fetchWebsite','arise'])

const addWebsite = async () => {
  errorMessage.value = ''

  if (title.value.length > 10) {
    errorMessage.value = 'Le titre ne doit pas dépasser 10 caractères.'
    return
  }

  if (!url.value.startsWith('http')) {
    url.value = `https://${url.value}`
  }

  try {
    isLoading.value = true

    await api.post('http://localhost:5005/api/user-website', {
      title: title.value,
      website_url: url.value
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    title.value = ''
    url.value = ''
    emit('fetchWebsite')
  } catch (error) {
    console.error('Error adding website:', error)
    errorMessage.value = 'Erreur lors de l\'ajout du site.'
  } finally {
    isLoading.value = false
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  }
}
</script>

<template>
  <form @submit.prevent="addWebsite" class="flex flex-col gap-2">
    <div class="grid gap-2 text-white">
      <div class="relative w-full max-w-sm items-center">
        <input
            type="text"
            v-model="title"
            placeholder="Youtube"
            maxlength="10"
            required
            class="pl-10 h-9 text-black rounded-lg input"
        />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
            <path fill="#888888" d="m18.5 4l1.16 4.35l-.96.26c-.45-.87-.91-1.74-1.44-2.18C16.73 6 16.11 6 15.5 6H13v10.5c0 .5 0 1 .33 1.25c.34.25 1 .25 1.67.25v1H9v-1c.67 0 1.33 0 1.67-.25c.33-.25.33-.75.33-1.25V6H8.5c-.61 0-1.23 0-1.76.43c-.53.44-.99 1.31-1.44 2.18l-.96-.26L5.5 4z"/>
          </svg>
          <hr class="border-secondary border-[1px] ml-1 h-6" />
        </span>
      </div>
    </div>

    <div class="grid gap-2 text-white">
      <div class="relative w-full max-w-sm items-center">
        <input
            id="url"
            type="text"
            v-model="url"
            placeholder="youtube.com"
            required
            class="input text-black pl-10 h-9 rounded-lg"
        />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="" width="22" height="22" viewBox="0 0 24 24">
            <path fill="#888888" d="M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.92 7.92 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8 8 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.7 15.7 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/>
          </svg>
          <hr class="border-secondary border-[1px] ml-1 h-6" />
        </span>
      </div>
    </div>

    <Button type="submit" class="w-full bg-secondary/80 hover:bg-secondary flex justify-center items-center p-2 gap-2 text-white h-8 text-center rounded-lg" :disabled="isLoading">
        <span v-if="isLoading">
         <svg width="22" height="22" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="20" stroke="white" stroke-width="4" fill="none"
                    stroke-dasharray="100" stroke-dashoffset="0">
              <animateTransform attributeType="XML" attributeName="transform" type="rotate"
                                from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </span>
        <p v-else class="text-xs font-normal">Add Website</p>
    </Button>

    <!-- Message d'erreur -->
    <p v-if="errorMessage" class="text-red-400 text-xs mt-1">
      {{ errorMessage }}
    </p>
  </form>
</template>

<style scoped>
.input {
  @apply flex h-9 w-full rounded-md border border-input text-black py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50;
}
</style>
