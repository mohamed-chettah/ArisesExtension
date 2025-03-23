<script setup lang="ts">

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";

const title = ref('')
const url = ref('')
const isLoading = ref(false)
const errors = ref({}) as { email?: string }
</script>

<template>

  <div>
    <h2 class="text-sm">Distraction Blocker</h2>

    <div class="flex gap-2">
      <div class="grid gap-2 text-white">
        <Label for="title">Title</Label>
        <Input
            id="title"
            type="text"
            v-model="title"
            placeholder="Youtube"
            required
            :class="{ 'border-red-500': errors.email }"
            class="border-secondary border-[1px] h-8 w-20"
        />
      </div>

      <div class="grid gap-2 text-white">
        <Label for="url">Url</Label>
        <Input
            id="url"
            type="text"
            v-model="url"
            placeholder="https://www.youtube.com/"
            required
            :class="{ 'border-red-500': errors.email }"
            class="border-secondary border-[1px] h-8"
        />
      </div>
    </div>
    <Button type="submit" class="w-full bg-secondary/80 hover:bg-secondary items-start text-white h-8 text-left" :disabled="isLoading">
      <span v-if="isLoading"></span>
      <svg class="text-white" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path  fill="currentColor" d="m9 4l2.5 5.5L17 12l-5.5 2.5L9 20l-2.5-5.5L1 12l5.5-2.5zm0 4.83L8 11l-2.17 1L8 13l1 2.17L10 13l2.17-1L10 11zM19 9l-1.26-2.74L15 5l2.74-1.25L19 1l1.25 2.75L23 5l-2.75 1.26zm0 14l-1.26-2.74L15 19l2.74-1.25L19 15l1.25 2.75L23 19l-2.75 1.26z"/></svg>

      <p class="text-xs font-normal">{{ isLoading ? 'Loading...' : 'Add Website' }} </p>
    </Button>

  </div>

</template>

<style scoped>

</style>