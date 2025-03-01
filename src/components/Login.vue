<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import { storage, StorageItemKey } from "wxt/storage";
import { Button } from '@/components/ui/button'

const email = ref('');
const password = ref('');

async function register() {
  try {
    console.log("Sending login request...");

    const response = await axios.post('http://localhost:5005/api/login', {
      email: email.value,
      password: password.value
    });

    // console.log("Response:", response.data);
    // storage.setItem("token", response.data.token);
  } catch (error) {
    // console.error("Error:", error.response ? error.response.data : error.message);
  }
}

</script>

<template>

<div class="flex flex-col items-center justify-center">

    
    <p class="text-center text-[#D9D9D9]">
        Rise Above. Go Beyond 
    </p>

    <p class="text-center text-white">Connect With</p>

    <Button class="bg-primary text-white">Click me</Button>
</div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>