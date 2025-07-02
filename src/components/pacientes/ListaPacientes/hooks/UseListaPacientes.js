import { ref, reactive, onMounted, watch } from 'vue'

export function UseListaPacientes(emit) {
  const pacientes = ref([])
  const modalAberto = ref(false)

  const novoPaciente = reactive({
    nome: '',
    idade: null,
    email: '',
    telefone: ''
  })

  onMounted(() => {
    const saved = localStorage.getItem('pacientes')
    if (saved) pacientes.value = JSON.parse(saved)
  })

  watch(
    pacientes,
    (nv) => {
      localStorage.setItem('pacientes', JSON.stringify(nv))
    },
    { deep: true }
  )

  function abrirModal() {
    novoPaciente.nome = ''
    novoPaciente.idade = null
    novoPaciente.email = ''
    novoPaciente.telefone = ''
    modalAberto.value = true
  }

  function fecharModal() {
    modalAberto.value = false
  }

  function mascararTelefone(e) {
    let v = e.target.value.replace(/\D/g, '')
    if (v.length > 11) v = v.slice(0, 11)
    if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3')
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2')
    } else if (v.length > 0) {
      v = v.replace(/^(\d{0,2})/, '($1')
    }
    novoPaciente.telefone = v
  }

  function adicionarPaciente() {
    if (!novoPaciente.nome || !novoPaciente.idade || !novoPaciente.email || !novoPaciente.telefone) return

    const id = Date.now()
    pacientes.value.push({
      id,
      nome: novoPaciente.nome,
      idade: novoPaciente.idade,
      email: novoPaciente.email,
      telefone: novoPaciente.telefone
    })
    fecharModal()
  }

  function removerPaciente(id) {
    if (confirm('Tem certeza que deseja remover este paciente?')) {
      pacientes.value = pacientes.value.filter(p => p.id !== id)
    }
  }

  return {
    pacientes,
    modalAberto,
    novoPaciente,
    abrirModal,
    fecharModal,
    mascararTelefone,
    adicionarPaciente,
    removerPaciente
  }
}
