<template>
  <section
    class="p-6 bg-green-50 dark:bg-gray-900 min-h-screen
           flex flex-col items-center justify-start w-full"
  >
    <button
      @click="$emit('voltar')"
      class="mb-6 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      ← Voltar à lista
    </button>

    <h2
      class="text-3xl font-bold mb-2 text-green-800 dark:text-green-300 text-center max-w-full break-words"
    >
      {{ paciente.nome }}
    </h2>
    <p
      class="mb-4 text-gray-900 dark:text-gray-300 text-center max-w-full break-words px-2"
    >
      Idade: {{ paciente.idade }} | Email: {{ paciente.email }} | Telefone:
      {{ paciente.telefone }}
    </p>

    <section class="mb-8 max-w-xl w-full px-2">
      <h3
        class="text-2xl font-semibold mb-2 text-green-700 dark:text-green-400 text-center"
      >
        Planos Alimentares
      </h3>

      <div class="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          v-model="filtroNome"
          type="text"
          placeholder="Filtrar por nome do plano"
          class="flex-grow rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 w-full sm:w-auto"
        />
        <input
          v-model="filtroData"
          type="date"
          class="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 w-full sm:w-auto"
        />
        <button
          @click="limparFiltros"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full sm:w-auto"
          title="Limpar filtros"
        >
          Limpar
        </button>
      </div>

      <form @submit.prevent="adicionarPlano" class="mb-6 w-full">
        <div class="mb-4">
          <label
            for="nomePlano"
            class="block mb-1 font-medium text-green-800 dark:text-green-300"
            >Nome do Plano</label
          >
          <input
            v-model="novoPlano.nome"
            id="nomePlano"
            type="text"
            required
            placeholder="Ex: Plano para perder peso"
            class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
          />
        </div>

        <div class="mb-4">
          <label
            for="descricaoPlano"
            class="block mb-1 font-medium text-green-800 dark:text-green-300"
            >Descrição</label
          >
          <textarea
            v-model="novoPlano.descricao"
            id="descricaoPlano"
            rows="3"
            required
            placeholder="Detalhes do plano alimentar"
            class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 resize-none"
          ></textarea>
        </div>

        <div class="mb-4">
          <label
            for="dataPlano"
            class="block mb-1 font-medium text-green-800 dark:text-green-300"
            >Data de registro</label
          >
          <input
            v-model="novoPlano.data"
            id="dataPlano"
            type="date"
            required
            class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto"
        >
          Adicionar Plano
        </button>
      </form>

      <ul class="space-y-6 max-w-full max-h-[600px] overflow-auto">
        <li
          v-for="(plano, idx) in planosFiltrados"
          :key="idx"
          class="border border-green-300 dark:border-green-600 rounded p-4 bg-white dark:bg-gray-800 w-full break-words"
        >
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 gap-2"
          >
            <h4
              class="font-semibold text-green-700 dark:text-green-400 break-words"
            >
              {{ plano.nome }}
            </h4>
            <button
              @click="excluirPlano(idx)"
              class="text-red-600 hover:text-red-800 font-bold text-xl self-start sm:self-auto"
              title="Excluir plano"
            >
              &times;
            </button>
          </div>

          <p class="mb-2 text-gray-800 dark:text-gray-300 break-words">
            {{ plano.descricao }}
          </p>
          <p
            class="mb-2 italic text-gray-600 dark:text-gray-400 text-sm break-words"
          >
            Criado em:
            {{ new Date(plano.data).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }) }}
          </p>

          <div
            v-if="plano.alimentos && plano.alimentos.length"
            class="mb-4 p-4 bg-white dark:bg-gray-800 rounded shadow flex justify-around text-gray-800 dark:text-gray-200 flex-wrap gap-4"
          >
            <div class="text-center min-w-[90px]">
              <div class="font-bold text-lg">{{ macros(plano).proteina }}</div>
              <div>Proteína (g)</div>
            </div>
            <div class="text-center min-w-[90px]">
              <div class="font-bold text-lg">{{ macros(plano).carb }}</div>
              <div>Carboidrato (g)</div>
            </div>
            <div class="text-center min-w-[90px]">
              <div class="font-bold text-lg">{{ macros(plano).gordura }}</div>
              <div>Gordura (g)</div>
            </div>
          </div>

          <!-- Lista alimentos do plano -->
          <ul
            class="mb-2 max-h-48 overflow-auto space-y-1"
            style="max-width: 100%;"
          >
            <li
              v-for="(alimento, aidx) in plano.alimentos"
              :key="aidx"
              class="flex justify-between items-center border border-green-200 dark:border-green-600 rounded px-3 py-2 bg-green-50 dark:bg-gray-700"
            >
              <div class="flex flex-col max-w-[75%]">
                <p class="font-semibold text-green-700 dark:text-green-400 break-words">
                  {{ alimento.name }}
                </p>
                <p class="text-sm text-gray-700 dark:text-gray-400">
                  Qtd: {{ alimento.quantity }} g
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400 break-words">
                  Proteína: {{ alimento.protein }} g | Carboidrato:
                  {{ alimento.carb }} g | Gordura: {{ alimento.fat }} g (por
                  100g)
                </p>
              </div>
              <button
                @click="removerAlimento(plano, aidx)"
                class="text-red-600 hover:text-red-800 font-bold ml-2 whitespace-nowrap"
                title="Remover alimento"
              >
                &times;
              </button>
            </li>
            <li
              v-if="!plano.alimentos || plano.alimentos.length === 0"
              class="italic text-gray-500 dark:text-gray-400"
            >
              Nenhum alimento adicionado.
            </li>
          </ul>
        </li>
        <li
          v-if="planosFiltrados.length === 0"
          class="italic text-gray-500 dark:text-gray-400 text-center"
        >
          Nenhum plano encontrado.
        </li>
      </ul>
    </section>

    <div class="mb-4 max-w-xl w-full px-2">
      <label
        for="planoSelect"
        class="block mb-1 font-medium text-green-800 dark:text-green-300"
        >Selecione o Plano</label
      >
      <select
        v-model="planoSelecionadoIndex"
        id="planoSelect"
        class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
      >
        <option disabled value="">-- Escolha um plano --</option>
        <option v-for="(plano, index) in planos" :key="index" :value="index">
          {{ plano.nome }} — {{ new Date(plano.data).toLocaleDateString('pt-BR') }}
        </option>
      </select>

      <button
        @click="enviarPlanoWhatsApp"
        :disabled="planoSelecionadoIndex === ''"
        class="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
      >
        Enviar plano pelo WhatsApp
      </button>
    </div>

    <section class="max-w-xl w-full px-2">
      <h3 class="text-2xl font-semibold mb-4 text-green-700 dark:text-green-400 text-center">
        Buscar Alimentos
      </h3>

      <form
        @submit.prevent="buscarAlimentos"
        class="mb-4 flex flex-col sm:flex-row gap-2 items-center"
      >
        <input
          v-model="query"
          type="search"
          placeholder="Buscar alimento"
          class="flex-grow rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 w-full sm:w-auto"
          required
          minlength="3"
        />
        <button
          type="submit"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition whitespace-nowrap w-full sm:w-auto"
          :disabled="loading"
        >
          {{ loading ? 'Buscando...' : 'Buscar' }}
        </button>
      </form>

      <ul class="space-y-3 max-h-96 overflow-auto max-w-full">
        <li
          v-for="(alimento, idx) in resultados"
          :key="idx"
          class="border border-green-300 dark:border-green-600 rounded p-3 bg-white dark:bg-gray-800 flex justify-between items-center flex-wrap gap-2"
        >
          <div class="flex-grow min-w-0">
            <h4 class="font-semibold text-green-700 dark:text-green-400 break-words">
              {{ alimento.product_name || alimento.product_name_en || 'Sem nome' }}
            </h4>
            <p class="text-sm text-gray-700 dark:text-gray-400 break-words">
              Calorias: {{ alimento.nutriments?.energy_100g ?? 'N/D' }}
            </p>
          </div>
          <button
            @click="adicionarAlimentoAoPlano(alimento)"
            class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition whitespace-nowrap"
            title="Adicionar ao plano"
          >
            +
          </button>
        </li>

        <li
          v-if="resultados.length === 0"
          class="italic text-gray-500 dark:text-gray-400 text-center"
        >
          Nenhum alimento encontrado.
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup>
import { useDetalhePaciente } from './hooks/useDetalhePaciente';
const props = defineProps({ paciente: Object })
const emit = defineEmits(['voltar', 'atualizar-planos'])

const {
  planos,
  novoPlano,
  filtroNome,
  filtroData,
  query,
  resultados,
  loading,
  planoSelecionadoIndex,
  planosFiltrados,
  adicionarPlano,
  buscarAlimentos,
  adicionarAlimentoAoPlano,
  removerAlimento,
  excluirPlano,
  macros,
  limparFiltros,
  enviarPlanoWhatsApp
} = useDetalhePaciente(props.paciente, emit)
</script>
