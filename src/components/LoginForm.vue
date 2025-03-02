<script setup>
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref, watch } from 'vue'
import axios from 'axios'
import { storage } from "wxt/storage"
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const isGoogleLoading = ref(false)
const isXLoading = ref(false)
const errors = ref({})
const googleError = ref('')
const xError = ref('')

// Fonction pour effacer les erreurs après un délai
function clearErrorsAfterDelay(delay = 5000) {
  setTimeout(() => {
    errors.value = {}
    googleError.value = ''
    xError.value = ''
  }, delay)
}

// Surveiller les changements d'erreurs et les effacer après un délai
watch(errors, (newErrors) => {
  if (Object.keys(newErrors).length > 0) {
    clearErrorsAfterDelay()
  }
})

watch(googleError, (newError) => {
  if (newError) {
    clearErrorsAfterDelay()
  }
})

watch(xError, (newError) => {
  if (newError) {
    clearErrorsAfterDelay()
  }
})

async function handleSubmit(e) {
  e.preventDefault()
  isLoading.value = true
  errors.value = {}
  try {
    console.log("Sending login request...")
    const response = await axios.post('http://localhost:5005/api/login', {
      email: email.value,
      password: password.value
    })
    // Gérer la réponse (token, redirection, etc.)
    storeData(response.data)
    router.push('/dashboard')
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

async function handleGoogleLogin(e) {
  e.preventDefault()
  isGoogleLoading.value = true
  googleError.value = ''
  try {
    console.log("Sending Google login request...")
    const response = await axios.post('http://localhost:5005/api/login/google')
    console.log(response.data)
  } catch (error) {
    googleError.value = error.response?.data?.message || 'Failed to login with Google'
  } finally {
    isGoogleLoading.value = false
  }
}

async function handleXLogin(e) {
  e.preventDefault()
  isXLoading.value = true
  xError.value = ''
  try {
    console.log("Sending X login request...")
    const response = await axios.get('http://localhost:5005/api/auth/twitter')
    if (response.data.url) {
      chrome.tabs.create({ url: response.data.url });
    }
  } catch (error) {
    xError.value = error.response?.data?.message || 'Failed to login with X'
  } finally {
    isXLoading.value = false
  }
}

async function storeData(data) {
  await storage.setItem('local:accessToken', data.access_token)
  await storage.setItem('local:user', data.user)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card class="overflow-hidden">
      <div class="flex flex-col items-center text-center">
          <h1 class="text-center text-[#D9D9D9]">
            Rise Above. Go Beyond 
          </h1>
      </div>
      <CardContent class="grid p-0 md:grid-cols-2">
        <form @submit="handleSubmit" class="p-6 md:p-8">
          <div class="flex flex-col gap-5">
            <!-- Message d'erreur général -->
            <div v-if="errors.general" class="text-red-500 text-sm">
              <p v-for="error in errors.general" :key="error">{{ error }}</p>
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
              <div class="flex items-center">
                <Label for="password">Password</Label>
                <a
                  href="#"
                  class="ml-auto text-xs underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
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
              {{ isLoading ? 'Loading...' : 'Continue' }}
            </Button>

            <a
                  href="#"
                  class="-mt-2 text-white text-xs ml-auto text-sm underline-offset-2 hover:underline"
                >
                Don't have an account?
                </a>

            <div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span class="relative z-10 bg-black px-2 text-white">
                Or
              </span>
            </div>

            <div class="flex justify-center gap-4">
              <form @submit="handleGoogleLogin">
                <div class="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    variant="outline" 
                    style="height: 65px !important; width: 65px !important; padding: 0 !important; border-radius: 9999px !important;"
                    class="border-secondary border-[1px] flex items-center justify-center" 
                    :disabled="isGoogleLoading"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 24px !important; height: 24px !important;">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  </Button>
                </div>
              </form>
              <form @submit="handleXLogin">
                <div class="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    variant="outline" 
                    style="height: 65px !important; width: 65px !important; padding: 0 !important; border-radius: 9999px !important;"
                    class="border-secondary border-[1px] flex items-center justify-center"
                    :disabled="isXLoading"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 24px !important; height: 24px !important;">
                      <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                </div>
              
              </form>
            </div>
            <div v-if="googleError" class="text-red-500 text-sm text-center">
                    {{ googleError }}
            </div>
            <div v-if="xError" class="text-red-500 text-sm text-center">
                  {{ xError }}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
