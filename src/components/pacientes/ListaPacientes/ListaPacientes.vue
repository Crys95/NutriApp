<template>
  <section class="p-6 bg-green-50 dark:bg-gray-900 min-h-screen">
    <header class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-green-800 dark:text-green-300">Pacientes</h2>
      <button @click="abrirModal" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
        + Novo Paciente
      </button>
    </header>

    <div class="w-full overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
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

    <transition name="fade">
      <div
        v-if="modalAberto"
        class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
        @click.self="fecharModal"
      >
        <form
          @submit.prevent="adicionarPaciente"
          class="bg-white dark:bg-gray-900 p-8 rounded-lg max-w-md w-full shadow-lg space-y-4 overflow-auto max-h-[90vh]"
        >
          <h3 class="text-2xl font-bold mb-2 text-green-700 dark:text-green-300 text-center">
            Novo Paciente
          </h3>

          <label class="block">
            <span class="text-gray-700 dark:text-gray-300">Nome</span>
            <input
              v-model="novoPaciente.nome"
              type="text"
              required
              placeholder="Nome completo"
              class="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </label>

          <label class="block">
            <span class="text-gray-700 dark:text-gray-300">Idade</span>
            <input
              v-model.number="novoPaciente.idade"
              type="number"
              min="0"
              required
              placeholder="Idade"
              class="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </label>

          <label class="block">
            <span class="text-gray-700 dark:text-gray-300">Email</span>
            <input
              v-model="novoPaciente.email"
              type="email"
              required
              placeholder="email@exemplo.com"
              class="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </label>

          <label class="block">
            <span class="text-gray-700 dark:text-gray-300">Telefone</span>
            <input
              v-model="novoPaciente.telefone"
              type="tel"
              required
              placeholder="(99) 99999-9999"
              @input="mascararTelefone"
              maxlength="15"
              class="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </label>

          <div class="flex justify-end gap-4 pt-4">
            <button
              type="button"
              @click="fecharModal"
              class="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
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

