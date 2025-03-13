
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// -- 1. Durées par défaut (en minutes)
const focusDuration = ref(25)
const shortBreakDuration = ref(5)
const longBreakDuration = ref(15)

// -- 2. Les états possibles
const MODES = {
  FOCUS: 'FOCUS',
  SHORT_BREAK: 'SHORT_BREAK',
  LONG_BREAK: 'LONG_BREAK'
}

// -- 3. State principal
const currentMode = ref(MODES.FOCUS)
const cycleCount = ref(0) // Nombre de sessions focus terminées avant la pause longue
const totalSeconds = ref(focusDuration.value * 60) // temps restant en secondes
const isRunning = ref(false)

let intervalId = null

// -- 4. Méthodes utilitaires

// Passer au mode "focus"
function startFocus() {
  currentMode.value = MODES.FOCUS
  totalSeconds.value = focusDuration.value * 60
  isRunning.value = false
}

// Passer en petite pause
function startShortBreak() {
  currentMode.value = MODES.SHORT_BREAK
  totalSeconds.value = shortBreakDuration.value * 60
  isRunning.value = false
}

// Passer en longue pause
function startLongBreak() {
  currentMode.value = MODES.LONG_BREAK
  totalSeconds.value = longBreakDuration.value * 60
  isRunning.value = false
  cycleCount.value = 0 // on réinitialise le compteur de cycles
}

// Lance ou met en pause le timer
function toggleTimer() {
  isRunning.value = !isRunning.value
}

// Remet tout à zéro
function resetTimer() {
  // On revient à un focus "pur"
  cycleCount.value = 0
  startFocus()
}

// Passe immédiatement à la prochaine étape (skip la session en cours)
function skipSession() {
  if (currentMode.value === MODES.FOCUS) {
    // On considère que c'est la fin d'un focus
    cycleCount.value++
    checkCycle()
  } else {
    // On était en break, on repart sur une session Focus
    startFocus()
  }
}

// Vérifie si on doit lancer une pause longue ou courte
function checkCycle() {
  if (cycleCount.value >= 4) {
    startLongBreak()
  } else {
    startShortBreak()
  }
}

// -- 5. Gestion du décompte (setInterval)
function tick() {
  totalSeconds.value--
  // Si le timer arrive à 0, on enchaîne
  if (totalSeconds.value <= 0) {
    if (currentMode.value === MODES.FOCUS) {
      // Fin d’une session focus => incrémenter cycle et voir si c’est pause longue ou courte
      cycleCount.value++
      checkCycle()
    } else {
      // Fin d’une pause => on repart sur une session focus
      startFocus()
    }
  }
}

onMounted(() => {
  intervalId = setInterval(() => {
    if (isRunning.value) {
      tick()
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

// -- 6. Calculs pour l’affichage
const minutes = computed(() => {
  return Math.floor(totalSeconds.value / 60)
})
const seconds = computed(() => {
  return totalSeconds.value % 60
})
const secondsFormatted = computed(() => {
  return seconds.value < 10 ? '0' + seconds.value : seconds.value
})

// -- 7. Loader circulaire (progress ring)
const radius = 50
const strokeWidth = 8
const circumference = 2 * Math.PI * (radius - strokeWidth / 2)

// Proportion du temps restant = (totalSeconds / (modeDuration))
//   -> on détermine la durée "totale" pour le mode en cours
function getCurrentModeMaxSeconds() {
  switch (currentMode.value) {
    case MODES.FOCUS:
      return focusDuration.value * 60
    case MODES.SHORT_BREAK:
      return shortBreakDuration.value * 60
    case MODES.LONG_BREAK:
      return longBreakDuration.value * 60
  }
}

// On calcule la fraction du cercle à “remplir”
const dashOffset = computed(() => {
  const max = getCurrentModeMaxSeconds()
  const fraction = totalSeconds.value / max
  return circumference * (1 - fraction)
})
</script>


<template>
  <div class="p-5 bg-dark-blue text-white">
    <h2 class="text-sm font-semibold">Pomodoro</h2>

    <!-- Sélecteur de durées (exemple) -->
    <div class="controls text-black">
      <label>Focus Time (min)</label>
      <input type="number" v-model.number="focusDuration" min="1" />

      <label>Short Break (min)</label>
      <input type="number" v-model.number="shortBreakDuration" min="1" />

      <label>Long Break (min)</label>
      <input type="number" v-model.number="longBreakDuration" min="1" />
    </div>

    <!-- Indicateur du mode actuel -->
    <p>Mode actuel : <strong>{{ currentMode }}</strong></p>
    <p>Cycle : {{ cycleCount }}/4</p>

    <!-- Cercle de progression + affichage du temps -->
    <div class="timer-wrapper">
      <svg
          class="progress-ring"
          :width="radius * 2"
          :height="radius * 2"
      >
        <!-- Cercle de fond (pas animé, sert de repère) -->
        <circle
            class="progress-ring__background"
            :r="radius - strokeWidth / 2"
            :cx="radius"
            :cy="radius"
            :stroke-width="strokeWidth"
        />
        <!-- Cercle animé -->
        <circle
            class="progress-ring__progress"
            :r="radius - strokeWidth / 2"
            :cx="radius"
            :cy="radius"
            :stroke-width="strokeWidth"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
        />
      </svg>
      <div class="time-display">
        {{ minutes }}:{{ secondsFormatted }}
      </div>
    </div>

    <!-- Boutons -->
    <div class="buttons">
      <button @click="toggleTimer">
        {{ isRunning ? 'Pause' : 'Start' }}
      </button>
      <button @click="resetTimer">Reset</button>
      <button @click="skipSession">Skip</button>
    </div>
  </div>
</template>

<style scoped>
.pomodoro-container {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: 1rem;
}

.controls {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}
.controls label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.controls input {
  width: 60px;
  padding: 0.25rem;
  text-align: center;
}

.timer-wrapper {
  position: relative;
  display: inline-block;
}

.progress-ring {
  transform: rotate(-90deg); /* Tourner pour que le cercle parte du haut */
}
.progress-ring__background,
.progress-ring__progress {
  fill: none;
  stroke: #ddd;
  r: 45;
  cx: 50;
  cy: 50;
}
.progress-ring__background {
  stroke: #eeeeee;
}
.progress-ring__progress {
  stroke: #7c3aed; /* Violet */
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.time-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: bold;
}

.buttons {
  margin-top: 1rem;
}

.buttons button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
}
</style>
