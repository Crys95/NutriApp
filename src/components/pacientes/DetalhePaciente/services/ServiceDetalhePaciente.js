export function ServiceDetalhePaciente(novoPlano) {
  if (!novoPlano.nome.trim() || !novoPlano.descricao.trim()) {
    throw new Error('Preencha nome e descrição do plano.')
  }

  return {
    nome: novoPlano.nome,
    descricao: novoPlano.descricao,
    data: new Date().toISOString().split('T')[0],
    alimentos: []
  }
}

export async function buscarAlimentosPorNome(termoBusca) {
  if (termoBusca.trim().length < 3) {
    throw new Error('Digite pelo menos 3 caracteres para buscar.')
  }

  const url = `https://br.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(termoBusca)}&search_simple=1&json=1&page_size=15`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Erro ao buscar alimentos')
  }

  const data = await response.json()
  return data.products || []
}
