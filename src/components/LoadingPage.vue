<script setup>
defineProps({
  isLoading: Boolean
})
</script>

<template>
  <div v-if="isLoading" class="flex flex-col justify-center h-fit items-center mt-32 gap-6">

        <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="20" stroke="white" stroke-width="4" fill="none"
                  stroke-dasharray="100" stroke-dashoffset="0">
            <animateTransform attributeType="XML" attributeName="transform" type="rotate"
                              from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>

        <p class="text-white bank-gothic">INITIALISATION</p>
  </div>
</template>
