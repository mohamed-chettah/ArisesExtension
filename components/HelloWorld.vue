<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import { storage, StorageItemKey } from "wxt/storage";

defineProps({
  msg: String,
});


const email = ref('');
const password = ref('');

async function register() {
  try {
    console.log("Sending login request...");

    const response = await axios.post('http://localhost:5005/api/login', {
      email: email.value,
      password: password.value
    });

    console.log("Response:", response.data);
    storage.setItem("token", response.data.token);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>
  <form @submit.prevent="register">
    <input type="email" v-model="email" />
    <input type="password" v-model="password" />
    <button type="submit">Register</button>
  </form>

  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the WXT and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
