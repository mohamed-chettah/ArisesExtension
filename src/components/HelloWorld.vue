<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import { storage, StorageItemKey } from "wxt/storage";


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

const count = ref(0);
</script>

<template>
  <p>dsefrsdffsdfs</p>
  <form @submit.prevent="register">
    <input type="email" v-model="email" />
    <input type="password" v-model="password" />
    <button type="submit">Register</button>
  </form>
  <router-link class="bg-white rounded-md p-2" to="/">🏠 Accueil</router-link>
      <router-link class="bg-white rounded-md p-2" to="/settings">⚙️ Paramètres</router-link>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>