# NutriApp

https://nutri-app-gilt.vercel.app/

🧾 1. Lista de Pacientes
Eu desenvolvi uma tela com uma lista de pacientes, exibindo:

Nome

Idade

Email

Telefone

Implementei um modal de cadastro para novos pacientes.

Adicionei persistência dos dados com localStorage.

Incluí máscara de telefone no formato brasileiro.

🧩 2. Organização em Hook (UseListaPacientes)
Separei a lógica de manipulação dos pacientes em um hook personalizado (UseListaPacientes.js), tornando o componente mais limpo e reutilizável.

🧍‍♂️ 3. Tela de Detalhes do Paciente
Ao clicar em um paciente, abro uma tela de detalhes que mostra:

Dados do paciente

Lista de planos alimentares associados

Filtros por nome do plano e data

📝 4. Cadastro de Plano Alimentar
Implementei um formulário para criar planos alimentares com:

Nome

Descrição

Data de criação (definida automaticamente como a data atual)

Os planos são armazenados no localStorage.

🍽️ 5. Adição de Alimentos ao Plano
Criei um campo de busca de alimentos utilizando a API do OpenFoodFacts.

Listei os alimentos encontrados com:

Nome

Calorias

Ao clicar no botão +, adicionei o alimento ao plano selecionado, com os seguintes dados:

Nome

Quantidade (100g)

Proteína

Carboidrato

Gordura

📊 6. Cálculo de Macros
Para cada plano com alimentos, exibo os macronutrientes totais:

Proteína

Carboidrato

Gordura

Os valores são calculados com base nas quantidades informadas.

🧹 7. Filtros e Exclusões
Adicionei filtros por nome e data para facilitar a busca de planos.

Implementei a remoção de alimentos individualmente e a exclusão de planos completos.

📤 8. Envio de Plano via WhatsApp
Implementei uma função para gerar uma mensagem formatada com:

Nome do plano

Descrição

Data

Lista de alimentos com quantidades e macros

A mensagem é enviada automaticamente pelo WhatsApp, usando o número do paciente com prefixo +55.

