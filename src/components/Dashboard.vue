<script setup>
import {Button} from '@/components/ui/button'
import {storage} from "wxt/storage"
import {useRouter} from "vue-router";
import {Separator} from "reka-ui";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Label} from "@/components/ui/label";
import FocusArea from "@/components/focus/FocusArea.vue";

const router = useRouter();
function logout(){
  storage.removeItem('local:accessToken')
  storage.removeItem('local:user')
  storage.removeItem('local:oauth')

  router.push('/')
}

const user = storage.getItem('local:user')

</script>

<template>

  <section class="flex flex-col gap-4 mx-2">

    <div class="flex items-center justify-between">
      <div class="flex gap-2">
        <img class="mx-auto w-[80px]" src="@/assets/arises.svg" alt="Arises logo" />
        <svg class="text-secondary" xmlns="http://www.w3.org/2000/svg" width="20" height="32" viewBox="0 0 24 24"><!-- Icon from All by undefined - undefined --><path fill="currentColor" d="m12 6.7l1.45 3.85L17.3 12l-3.85 1.45L12 17.3l-1.45-3.85L6.7 12l3.85-1.45zM12 1L9 9l-8 3l8 3l3 8l3-8l8-3l-8-3z"/></svg>
      </div>
      <div class="flex gap-2">
        <svg class="text-white text-sm" xmlns="http://www.w3.org/2000/svg" width="26" height="32" viewBox="0 0 24 24"><!-- Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87q.11.06.22.127c.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a8 8 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a7 7 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a7 7 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7 7 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124q.108-.066.22-.128c.332-.183.582-.495.644-.869z"/><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0"/></g></svg>
      </div>
    </div>

    <hr class="border-white border-[0.5px] w-full" />

    <Tabs default-value="focus">
      <TabsList class="grid w-full grid-cols-3 bg-dark-blue text-white">
        <TabsTrigger value="focus" class="flex gap-1" >
          Focus
        </TabsTrigger>
        <TabsTrigger value="bookmarks" >
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

    <hr class="border-white border-[0.5px] w-full" />


    <Button class="mt-5" @click="logout">Logout</Button>
  </section>

</template>

<style scoped>

</style>


