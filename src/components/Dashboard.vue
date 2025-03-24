<script setup>
import {Button} from '@/components/ui/button'
import {storage} from "wxt/storage"
import {useRouter} from "vue-router";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import FocusArea from "@/components/focus/FocusArea.vue";

const router = useRouter();
function logout(){
  storage.removeItem('local:accessToken')
  storage.removeItem('local:user')
  storage.removeItem('local:oauth')
  router.push('/')
}

const username = ref('')

// Charger le username depuis le storage à l'ouverture du composant
onMounted(async () => {
  const user = await storage.getItem('local:user')
  username.value = user?.name ?? 'Guest'
})

</script>

<template>

  <section class="flex flex-col gap-4 mx-[2px]">

    <div class="flex items-center justify-between">
      <div class="flex  items-center gap-2">
        <img class="w-[80px]" src="@/assets/arises.svg" alt="Arises logo" />
        <svg class="text-secondary" xmlns="http://www.w3.org/2000/svg" width="20" height="32" viewBox="0 0 24 24"><!-- Icon from All by undefined - undefined --><path fill="currentColor" d="m12 6.7l1.45 3.85L17.3 12l-3.85 1.45L12 17.3l-1.45-3.85L6.7 12l3.85-1.45zM12 1L9 9l-8 3l8 3l3 8l3-8l8-3l-8-3z"/></svg>
        <div class="flex items-center gap-3">
          <img class="w-[50px] h-[50px] ml-[10px] rounded-xl border-secondary border-[1px]" src="https://avatars.githubusercontent.com/u/120135426?v=4" alt="User avatar" />
          <div class="">
            <p class="text-white text-sm bank-gothic">{{ username.toUpperCase()}} 🏴‍☠️</p>
            <p class="text-white/70 text-xs bank-gothic">Grade E</p>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <svg @click="logout" class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="26" height="32" viewBox="0 0 24 24"><path fill="#FFFFFF" d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"/></svg></div>
    </div>

    <hr class="border-white border-[0.5px] w-full" />

    <Tabs default-value="focus">
      <TabsList class="grid w-full grid-cols-3 bg-dark-blue text-white">
        <TabsTrigger value="focus" class="flex gap-1" >
          Focus
        </TabsTrigger>
        <TabsTrigger value="bookmarks" :disabled="true">
          Bookmarks
        </TabsTrigger>
        <TabsTrigger value="soon" :disabled="true">
          Soon
        </TabsTrigger>
      </TabsList>
      <TabsContent value="focus">
        <FocusArea />
      </TabsContent>
      <TabsContent value="bookmarks">
        <!--        soon Area-->
      </TabsContent>
      <TabsContent value="soon">
        <!--        focus Area-->
      </TabsContent>
    </Tabs>

<!--    <hr class="border-white border-[0.5px] w-full" />-->


<!--    <Button class="mt-5" @click="logout">Logout</Button>-->
  </section>

</template>

<style scoped>

</style>


