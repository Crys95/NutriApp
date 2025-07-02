<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
    <header class="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <h1 class="text-2xl font-extrabold text-green-700 dark:text-green-400 select-none">
        NutriApp
      </h1>

      <button @click="toggleTheme" :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"
        class="p-2 rounded-full bg-green-100 dark:bg-green-700 hover:bg-green-200 dark:hover:bg-green-600 transition">
        <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-800" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-700" fill="currentColor"
          viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
        </svg>
      </button>
    </header>

    <main class="flex-grow px-8 py-6 max-w-7xl mx-auto w-full">
      <ListaPacientes v-if="view === 'lista'" :pacientes="pacientes" @ver-detalhes="verDetalhesPaciente"
        @atualizar-pacientes="atualizarPacientes" />

      <DetalhePaciente v-if="view === 'detalhe'" :paciente="pacienteSelecionado" @voltar="voltarLista"
        @atualizar-planos="atualizarPlanosPaciente" />
    </main>

    <footer class="bg-green-100 dark:bg-gray-900 text-green-800 dark:text-green-400 text-center p-4 select-none">
      NutriApp © 2025
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import ListaPacientes from './components/pacientes/ListaPacientes/ListaPacientes.vue'
import DetalhePaciente from './components/pacientes/DetalhePaciente/DetalhePaciente.vue'

const view = ref('lista')
const pacienteSelecionado = ref(null)
const pacientes = ref([])

const theme = ref(localStorage.getItem('tema') || 'light')

watch(theme, (newVal) => {
  if (newVal === 'dark') document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
  localStorage.setItem('tema', newVal)
})

onMounted(() => {
  if (theme.value === 'dark') document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')

  const saved = localStorage.getItem('pacientes')
  if (saved) pacientes.value = JSON.parse(saved)
})

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function verDetalhesPaciente(paciente) {
  pacienteSelecionado.value = paciente
  view.value = 'detalhe'
}

function voltarLista() {
  pacienteSelecionado.value = null
  view.value = 'lista'
}

function atualizarPacientes(novaLista) {
  pacientes.value = novaLista
  localStorage.setItem('pacientes', JSON.stringify(novaLista))
}

function atualizarPlanosPaciente(novosPlanos) {
  if (!pacienteSelecionado.value) return
  const id = pacienteSelecionado.value.id
  localStorage.setItem(`planos_${id}`, JSON.stringify(novosPlanos))
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

body {
  font-family: 'Montserrat', sans-serif;
}
</style>
