<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '../lib/api.ts'
import { storage } from "wxt/storage"
import LoadingPage from "@/components/LoadingPage.vue"

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errors = ref({})
const loading = ref(false)

// Fonction pour effacer les erreurs après un délai
function clearErrorsAfterDelay(delay = 5000) {
  setTimeout(() => {
    errors.value = {}
  }, delay)
}

// Surveiller les erreurs et les effacer automatiquement
watch(errors, (newErrors) => {
  if (Object.keys(newErrors).length > 0) {
    clearErrorsAfterDelay()
  }
})

async function handleSignUp(e) {
  e.preventDefault()
  isLoading.value = true
  errors.value = {}

  try {
    const response = await api.post('/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })

    await storeData(response.data)
    await router.push('/dashboard') // Redirige vers le dashboard après inscription réussie
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      errors.value = { general: [error.response.data.message] }
    } else {
      console.log(error)
      errors.value = { general: ['An unexpected error occurred'] }
    }
  } finally {
    isLoading.value = false
  }
}

async function storeData(data) {
  await storage.setItem('local:accessToken', data.token)
  await storage.setItem('local:user', data.user)
}
</script>

<template>
  <img class="mx-auto" src="@/assets/arises.svg" alt="Arises logo" />

  <div v-if="loading">
    <LoadingPage :isLoading="loading" />
  </div>

  <div v-else class="flex flex-col gap-6">
    <Card class="overflow-hidden">
      <div class="flex flex-col items-center text-center">
        <h1 class="text-center text-[#D9D9D9]">
          Rise Above. Go Beyond
        </h1>
      </div>

      <CardContent class="grid p-0 md:grid-cols-2">
        <form @submit="handleSignUp" class="p-6 md:p-8">
          <div class="flex flex-col gap-5">
            <!-- Message d'erreur général -->
            <div v-if="errors.general" class="text-red-500 text-sm">
              <p v-for="error in errors.general" :key="error">{{ error }}</p>
            </div>

            <div class="grid gap-2 text-white">
              <Label for="name">Name</Label>
              <Input
                  id="name"
                  type="text"
                  v-model="name"
                  placeholder="Your Name"
                  required
                  :class="{ 'border-red-500': errors.name }"
                  class="border-secondary border-[1px]"
              />
              <div v-if="errors.name" class="text-red-500 text-sm">
                <p v-for="error in errors.name" :key="error">{{ error }}</p>
              </div>
            </div>

            <div class="grid gap-2 text-white">
              <Label for="email">Email</Label>
              <Input
                  id="email"
                  type="email"
                  v-model="email"
                  placeholder="m@example.com"
                  required
                  :class="{ 'border-red-500': errors.email }"
                  class="border-secondary border-[1px]"
              />
              <div v-if="errors.email" class="text-red-500 text-sm">
                <p v-for="error in errors.email" :key="error">{{ error }}</p>
              </div>
            </div>

            <div class="grid gap-2 text-white">
              <Label for="password">Password</Label>
              <Input
                  id="password"
                  type="password"
                  v-model="password"
                  placeholder="********"
                  required
                  :class="{ 'border-red-500': errors.password }"
                  class="border-secondary border-[1px]"
              />
              <div v-if="errors.password" class="text-red-500 text-sm">
                <p v-for="error in errors.password" :key="error">{{ error }}</p>
              </div>
            </div>

            <Button type="submit" class="w-full bg-primary text-white" :disabled="isLoading">
              <span v-if="isLoading"></span>
              {{ isLoading ? 'Signing Up...' : 'Create Account' }}
            </Button>

            <a
                @click="router.push('/')"
                class="cursor-pointer -mt-2 text-white text-xs ml-auto underline-offset-2 hover:underline"
            >
              Already have an account? Log in
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
