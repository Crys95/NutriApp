<template>
  <section class="p-4 sm:p-6 bg-green-50 dark:bg-gray-900 min-h-screen">
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
      <h2 class="text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-300">Pacientes</h2>
      <button
        @click="abrirModal"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto text-center"
      >
        + Novo Paciente
      </button>
    </header>

    <div class="hidden sm:block w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-auto">
        <thead class="bg-green-100 dark:bg-green-700 shadow-md">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-green-900 dark:text-green-200 uppercase tracking-wide">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-green-900 dark:text-green-200 uppercase tracking-wide">Idade</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-green-900 dark:text-green-200 uppercase tracking-wide">Email</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-green-900 dark:text-green-200 uppercase tracking-wide">Telefone</th>
            <th class="px-6 py-3 text-center text-xs font-semibold text-green-900 dark:text-green-200 uppercase tracking-wide">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="paciente in pacientes"
            :key="paciente.id"
            class="cursor-pointer hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200"
            @click="$emit('ver-detalhes', paciente)"
          >
            <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">{{ paciente.nome }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ paciente.idade }}</td>
            <td class="px-6 py-4 break-words max-w-xs text-gray-900 dark:text-white">{{ paciente.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ paciente.telefone }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center" @click.stop>
              <button
                @click="removerPaciente(paciente.id)"
                class="text-red-600 hover:text-red-800 dark:hover:text-red-400 font-semibold transition-colors"
                title="Remover paciente"
              >
                Remover
              </button>
            </td>
          </tr>
          <tr v-if="pacientes.length === 0">
            <td colspan="5" class="px-6 py-6 text-center text-gray-500 dark:text-gray-400 italic">
              Nenhum paciente cadastrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="sm:hidden space-y-4">
      <div
        v-for="paciente in pacientes"
        :key="paciente.id"
        @click="$emit('ver-detalhes', paciente)"
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-green-50 dark:hover:bg-gray-700 transition"
      >
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-semibold text-green-800 dark:text-green-300">{{ paciente.nome }}</h3>
          <button
            @click.stop="removerPaciente(paciente.id)"
            class="text-red-600 hover:text-red-800 dark:hover:text-red-400 font-semibold"
            title="Remover paciente"
          >
            Remover
          </button>
        </div>
        <p><strong>Idade:</strong> {{ paciente.idade }}</p>
        <p><strong>Email:</strong> {{ paciente.email }}</p>
        <p><strong>Telefone:</strong> {{ paciente.telefone }}</p>
      </div>

      <div v-if="pacientes.length === 0" class="text-center text-gray-500 dark:text-gray-400 italic">
        Nenhum paciente cadastrado.
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="modalAberto"
        class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 sm:p-0"
        @click.self="fecharModal"
      >
        <form
          @submit.prevent="adicionarPaciente"
          class="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-lg max-w-md w-full shadow-lg space-y-4 max-h-[90vh] overflow-auto"
        >
          <h3 class="text-xl sm:text-2xl font-bold mb-2 text-green-700 dark:text-green-300 text-center">
            Novo Paciente
          </h3>

          <label class="block">
            <span class="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Nome</span>
            <input
              v-model="novoPaciente.nome"
              type="text"
              required
              placeholder="Nome completo"
              class="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
          </label>

          <label class="block">
            <span class="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Idade</span>
            <input
              v-model.number="novoPaciente.idade"
              type="number"
              min="0"
              required
              placeholder="Idade"
              class="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
          </label>

          <label class="block">
            <span class="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Email</span>
            <input
              v-model="novoPaciente.email"
              type="email"
              required
              placeholder="email@exemplo.com"
              class="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
          </label>

          <label class="block">
            <span class="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Telefone</span>
            <input
              v-model="novoPaciente.telefone"
              type="tel"
              required
              placeholder="(99) 99999-9999"
              @input="mascararTelefone"
              maxlength="15"
              class="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
          </label>

          <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              @click="fecharModal"
              class="w-full sm:w-auto px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { UseListaPacientes } from './hooks/UseListaPacientes';

const emit = defineEmits(['ver-detalhes'])

const {
  pacientes,
  modalAberto,
  novoPaciente,
  abrirModal,
  fecharModal,
  mascararTelefone,
  adicionarPaciente,
  removerPaciente
} = UseListaPacientes(emit)
</script>

