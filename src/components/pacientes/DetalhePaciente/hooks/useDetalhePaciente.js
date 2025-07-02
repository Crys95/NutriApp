import { ref, computed, watch, onMounted } from 'vue'
import { buscarAlimentosPorNome, ServiceDetalhePaciente } from '../services/ServiceDetalhePaciente'
export function useDetalhePaciente(paciente, emit) {
  const planos = ref([])
  const novoPlano = ref({ nome: '', descricao: '', data: '', alimentos: [] })
  const filtroNome = ref('')
  const filtroData = ref('')
  const query = ref('')
  const resultados = ref([])
  const loading = ref(false)
  const planoSelecionadoIndex = ref('')

  const carregarPlanos = () => {
    const data = localStorage.getItem(`planos_${paciente.id}`)
    planos.value = data ? JSON.parse(data) : []
  }

  onMounted(() => {
    carregarPlanos()
  })

  watch(planos, (newVal) => {
    localStorage.setItem(`planos_${paciente.id}`, JSON.stringify(newVal))
    emit('atualizar-planos', newVal)
  }, { deep: true })

  function adicionarPlano() {
    try {
      const novo = ServiceDetalhePaciente(novoPlano.value)
      planos.value.push(novo)
      novoPlano.value = { nome: '', descricao: '', data: '', alimentos: [] }
    } catch (e) {
      alert(e.message)
    }
  }

  async function buscarAlimentos() {
    loading.value = true
    resultados.value = []

    try {
      resultados.value = await buscarAlimentosPorNome(query.value)
    } catch (e) {
      alert(e.message)
    } finally {
      loading.value = false
    }
  }

  function adicionarAlimentoAoPlano(alimento) {
    if (planos.value.length === 0) {
      alert('Adicione ao menos um plano alimentar antes de adicionar alimentos.')
      return
    }
    if (planoSelecionadoIndex.value === '') {
      alert('Selecione um plano para adicionar o alimento.')
      return
    }

    const plano = planos.value[planoSelecionadoIndex.value]
    const al = {
      name: alimento.product_name || alimento.product_name_en || 'Sem nome',
      protein: alimento.nutriments?.proteins_100g ?? 0,
      carb: alimento.nutriments?.carbohydrates_100g ?? 0,
      fat: alimento.nutriments?.fat_100g ?? 0,
      quantity: 100
    }

    plano.alimentos.push(al)
  }

  function removerAlimento(plano, idx) {
    plano.alimentos.splice(idx, 1)
  }

  function excluirPlano(idx) {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
      planos.value.splice(idx, 1)
    }
  }

  function macros(plano) {
    if (!plano.alimentos?.length) {
      return { proteina: 0, carb: 0, gordura: 0 }
    }

    const total = plano.alimentos.reduce(
      (acc, cur) => {
        acc.proteina += cur.protein * (cur.quantity / 100)
        acc.carb += cur.carb * (cur.quantity / 100)
        acc.gordura += cur.fat * (cur.quantity / 100)
        return acc
      },
      { proteina: 0, carb: 0, gordura: 0 }
    )

    return {
      proteina: Math.round(total.proteina),
      carb: Math.round(total.carb),
      gordura: Math.round(total.gordura)
    }
  }

  function limparFiltros() {
    filtroNome.value = ''
    filtroData.value = ''
  }

  const planosFiltrados = computed(() => {
    return planos.value.filter((plano) => {
      const nomeMatch = plano.nome.toLowerCase().includes(filtroNome.value.toLowerCase())
      const dataMatch = filtroData.value ? plano.data === filtroData.value : true
      return nomeMatch && dataMatch
    })
  })

  function enviarPlanoWhatsApp() {
    if (planoSelecionadoIndex.value === '') {
      alert('Selecione um plano para enviar.')
      return
    }

    const plano = planos.value[planoSelecionadoIndex.value]
    if (!plano) {
      alert('Plano inválido.')
      return
    }

    let texto = `Plano Alimentar: ${plano.nome}\nDescrição: ${plano.descricao}\nData: ${new Date(plano.data).toLocaleDateString('pt-BR')}\n\nAlimentos:\n`

    if (plano.alimentos?.length) {
      plano.alimentos.forEach((a, i) => {
        texto += `${i + 1}. ${a.name} - ${a.quantity}g\n   Proteína: ${a.protein}g | Carboidrato: ${a.carb}g | Gordura: ${a.fat}g\n`
      })
    } else {
      texto += 'Nenhum alimento adicionado.\n'
    }

    let numero = paciente.telefone.trim().replace(/\D/g, '')
    if (!numero.startsWith('55')) {
      numero = `55${numero}`
    }

    const linkWhats = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
    window.open(linkWhats, '_blank')
  }

  return {
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
  }
}
