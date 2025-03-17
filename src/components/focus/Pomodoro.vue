<!-- Pomodoro.vue -->
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storage } from "wxt/storage"

/**
 * Liste des modes Pomodoro.
 */
const MODES = {
  FOCUS: 'Focus',
  SHORT_BREAK: 'Short Break',
  LONG_BREAK: 'Long Break'
}

/**
 * Liste possible pour la durée du focus (en minutes).
 */
const focusDurations = ref([5, 10, 15, 20, 25, 30, 45, 60, 90])
const selectedFocusDuration = ref(25) // valeur par défaut : 25 minutes

/**
 * Durées (en minutes) pour la pause courte et la pause longue.
 */
const shortBreakDuration = ref(5)
const longBreakDuration = ref(20)

/**
 * État principal du timer.
 */
const currentMode = ref(MODES.FOCUS)
const cycleCount = ref(0)
const totalSeconds = ref(selectedFocusDuration.value * 60)
const isRunning = ref(false)

/**
 * Interval pour setInterval
 */
let intervalId = null

/**
 * Fonctions de transition entre les modes
 */
function startFocus() {
  currentMode.value = MODES.FOCUS
  totalSeconds.value = selectedFocusDuration.value * 60
  isRunning.value = false
  saveState("stop-timer")
}

function startShortBreak() {
  currentMode.value = MODES.SHORT_BREAK
  totalSeconds.value = shortBreakDuration.value * 60
  isRunning.value = false
  saveState("stop-timer")
}

function startLongBreak() {
  currentMode.value = MODES.LONG_BREAK
  totalSeconds.value = longBreakDuration.value * 60
  isRunning.value = false
  cycleCount.value = 0
  saveState("stop-timer")
}

/**
 * Permet de changer la durée Focus.
 * Dès qu'on change, on relance le mode Focus avec la nouvelle durée.
 */
function selectFocusDuration(duration) {
  selectedFocusDuration.value = duration
  startFocus()
}

/**
 * Lance / met en pause le timer (toggle).
 */
function toggleTimer() {
  isRunning.value = !isRunning.value
  if(isRunning.value) {
    saveState("start-timer")
  } else {
    saveState("stop-timer")
  }
}

/**
 * Reset complet : revient au premier Focus et cycleCount = 0
 */
function resetTimer() {
  cycleCount.value = 0
  startFocus()
}

/**
 * Skip la session en cours et passe immédiatement à la suivante.
 */
function skipSession() {
  if (currentMode.value === MODES.FOCUS) {
    cycleCount.value++
    checkCycle()
  } else {
    startFocus()
  }
  saveState()
}

/**
 * Vérifie s'il faut une pause longue ou courte en fin de Focus.
 */
function checkCycle() {
  if (cycleCount.value > 4) {
    startLongBreak()
  } else {
    startShortBreak()
  }
}

/**
 * tick() est appelé chaque seconde si isRunning = true.
 */
function tick() {
  totalSeconds.value--
  if (totalSeconds.value <= 0) {
    if (currentMode.value === MODES.FOCUS) {
      cycleCount.value++
      checkCycle()
    } else {
      startFocus()
    }
  }
  else {
    if (currentMode.value === MODES.FOCUS) {
      chrome.runtime.sendMessage({ action: "redirect" });
    }
  }
  saveState()
}

/**
 * Utilitaires pour chrome.storage.local
 * (Assure-toi d'avoir "storage" dans les permissions de ton manifest.json)
 */
function saveToChromeStorage(key, data) {
  storage.setItem('local:' + key, data)
}

function loadFromChromeStorage(key, defaultValue) {
  return new Promise((resolve) => {
    storage.getItem('local:' + key).then((result) => {
      resolve(result ?? defaultValue)
    })
  })
}

async function saveState(message) {
  await saveToChromeStorage('pomodoroState', {
    currentMode: currentMode.value,
    cycleCount: cycleCount.value,
    totalSeconds: totalSeconds.value,
    isRunning: isRunning.value,
    selectedFocusDuration: selectedFocusDuration.value
  })
  let datas = {
    currentMode: currentMode.value,
    cycleCount: cycleCount.value,
    totalSeconds: totalSeconds.value,
    isRunning: isRunning.value,
    selectedFocusDuration: selectedFocusDuration.value
  }
  await chrome.runtime.sendMessage({ action: message, datas: datas })
}

async function loadState() {
  const state = await loadFromChromeStorage('pomodoroState', null)
  if (state) {
    currentMode.value = state.currentMode
    cycleCount.value = state.cycleCount
    totalSeconds.value = state.totalSeconds
    isRunning.value = state.isRunning
    selectedFocusDuration.value = state.selectedFocusDuration
  }
}

/**
 * Lifecycle hooks
 */
onMounted(async () => {
  await loadState()
  // Lance le timer (vérifie toutes les secondes si isRunning = true)
  intervalId = setInterval(() => {
    if (isRunning.value) {
      tick()
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
  saveState()
})

/**
 * Computed property pour l'affichage du temps.
 * - Affiche HH:MM:SS si >= 1 heure
 * - Sinon, affiche MM:SS
 */
const timeFormatted = computed(() => {
  const total = totalSeconds.value

  // Heures
  const hours = Math.floor(total / 3600)
  // Reste de secondes après avoir retiré les heures
  const remainder = total % 3600
  // Minutes
  const mins = Math.floor(remainder / 60)
  // Secondes
  const secs = remainder % 60

  if (hours > 0) {
    // Format HH:MM:SS
    return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  } else {
    // Format MM:SS
    return `${mins}:${String(secs).padStart(2, '0')}`
  }
})
</script>

<template>
  <div>
    <!-- Titre -->
    <h2 class="text-sm">Pomodoro</h2>

    <!-- Boutons de choix de durée (Focus) -->
    <div class="flex gap-2 flex-wrap justify-center mb-2">
      <button
          v-for="duration in focusDurations"
          :key="duration"
          @click="selectFocusDuration(duration)"
          :class="[
          'py-1 px-3 rounded-lg transition',
          duration === selectedFocusDuration
            ? 'bg-secondary text-white'
            : 'bg-secondary/40 text-white hover:bg-secondary'
        ]"
      >
        {{ duration }}
      </button>
    </div>

    <div class="text-center">
      <!-- Indicateur du mode actuel -->
      <strong class="text-center font-semibold text-lg">{{ currentMode }}</strong>
      <div class="bank-gothic text-3xl font-semibold mt-2">
        {{ timeFormatted }}
      </div>
      <p class="mt-1">Cycle : {{ cycleCount }}/4</p>
    </div>

    <!-- Boutons de contrôle (Reset, Play/Pause, Skip) -->
    <div class="flex gap-2 justify-center mt-4">
      <!-- Reset -->
      <button class="second-button-time" @click="resetTimer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388m15.408 3.352a.75.75 0 0 0-.919.53a7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035a.75.75 0 0 0-.53-.918"
              clip-rule="evenodd"
          />
        </svg>
        Reset
      </button>

      <!-- Play / Pause -->
      <button class="main-button-time" @click="toggleTimer">
        <template v-if="isRunning">
          <!-- Icône Pause -->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20">
            <path
                fill="currentColor"
                d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3zm7 0a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75z"
            />
          </svg>
        </template>
        <template v-else>
          <!-- Icône Play -->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20">
            <path
                fill="currentColor"
                d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538z"
            />
          </svg>
        </template>
      </button>

      <!-- Skip -->
      <button class="second-button-time" @click="skipSession">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <path
              fill="currentColor"
              d="M5.055 7.06c-1.25-.713-2.805.19-2.805 1.63v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34z"
          />
        </svg>
        Skip
      </button>
    </div>
  </div>
</template>

<style scoped>
.main-button-time {
  @apply bg-secondary p-2 rounded-lg flex items-center gap-2;
  /* Adapte selon ton design */
}

.second-button-time {
  @apply bg-secondary/60 p-2 rounded-lg flex items-center gap-2;
  /* Adapte selon ton design */
}
</style>
