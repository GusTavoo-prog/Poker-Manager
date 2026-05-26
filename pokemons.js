// ======================================================
// PROTEÇÃO DA PÁGINA
// ======================================================

// Garante que apenas usuários logados entrem na página
protegerPagina();


// ======================================================
// VARIÁVEIS GLOBAIS
// ======================================================

// Lista completa de Pokémons carregada da PokeAPI
let listaPokemonAPI = [];

// Pokémon escolhido no formulário
let pokemonSelecionado = null;


// ======================================================
// CARREGAMENTO INICIAL
// ======================================================

// Carrega lista de treinadores
carregarTreinadores();

// Carrega lista real de Pokémons
carregarListaPokemons();

// Carrega cartas já cadastradas
carregarPokemons();


// ======================================================
// CARREGAR TREINADORES
// ======================================================

async function carregarTreinadores() {

  // Busca treinadores cadastrados no Supabase
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/treinadores?select=*&order=nome.asc`,
    {
      method: "GET",
      headers: getHeaders()
    }
  );

  // Converte resposta
  const treinadores = await response.json();

  // Select de treinadores
  const select = document.getElementById("treinador");

  // Limpa select
  select.innerHTML = `
    <option value="">
      Selecione o treinador
    </option>
  `;

  // Preenche select
  treinadores.forEach(treinador => {
    select.innerHTML += `
      <option value="${treinador.id}">
        ${treinador.nome} - Nível ${treinador.nivel}
      </option>
    `;
  });
}


// ======================================================
// CARREGAR LISTA REAL DE POKÉMONS
// ======================================================

async function carregarListaPokemons() {

  // Busca os 151 primeiros Pokémons da PokeAPI
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=151"
  );

  // Converte resposta
  const data = await response.json();

  // Salva lista global
  listaPokemonAPI = data.results;

  // Preenche o select
  preencherSelectPokemons(listaPokemonAPI);
}


// ======================================================
// PREENCHER SELECT DE POKÉMONS
// ======================================================

function preencherSelectPokemons(lista) {

  // Select dos Pokémons
  const select = document.getElementById("pokemonSelect");

  // Limpa select
  select.innerHTML = `
    <option value="">
      Selecione um Pokémon
    </option>
  `;

  // Adiciona cada Pokémon
  lista.forEach((pokemon, index) => {

    // Pega ID pela URL da PokeAPI
    const partes = pokemon.url.split("/");
    const id = partes[partes.length - 2];

    select.innerHTML += `
      <option value="${id}" data-name="${pokemon.name}">
        #${id} - ${formatarNome(pokemon.name)}
      </option>
    `;
  });
}


// ======================================================
// FILTRAR POKÉMONS
// ======================================================

function filtrarPokemons() {

  // Texto digitado pelo usuário
  const busca = document
    .getElementById("buscaPokemon")
    .value
    .toLowerCase();

  // Filtra lista
  const filtrados = listaPokemonAPI.filter(pokemon =>
    pokemon.name.includes(busca)
  );

  // Atualiza select
  preencherSelectPokemons(filtrados);
}


// ======================================================
// SELECIONAR POKÉMON
// ======================================================

async function selecionarPokemon() {

  // ID escolhido
  const id = document.getElementById("pokemonSelect").value;

  // Se nada foi escolhido
  if (!id) {
    pokemonSelecionado = null;
    document.getElementById("previewCarta").innerHTML = `
      <p class="text-slate-300 text-center">
        Escolha um Pokémon para visualizar a carta.
      </p>
    `;
    return;
  }

  // Busca detalhes do Pokémon escolhido
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${id}`
  );

  // Converte resposta
  const data = await response.json();

  // Guarda Pokémon selecionado
  pokemonSelecionado = {
    id: data.id,
    nome: formatarNome(data.name),
    tipo: formatarNome(data.types[0].type.name),
    imagem: data.sprites.other["official-artwork"].front_default
  };

  // Mostra a carta
  renderizarPreviewCarta();
}


// ======================================================
// RENDERIZAR PRÉVIA DA CARTA
// ======================================================

function renderizarPreviewCarta() {

  // Se não tiver Pokémon escolhido
  if (!pokemonSelecionado) {
    return;
  }

  // Pega dados complementares
  const nivel = document.getElementById("nivel").value || "?";
  const raridade = document.getElementById("raridade").value || "Não definida";
  const data = document.getElementById("data").value || "Sem data";

  // Área da prévia
  const preview = document.getElementById("previewCarta");

  // Cria a carta visual
  preview.innerHTML = criarHtmlCarta(
    pokemonSelecionado.nome,
    pokemonSelecionado.tipo,
    nivel,
    raridade,
    data,
    pokemonSelecionado.imagem,
    "Prévia"
  );
}


// Atualiza a prévia quando usuário muda dados
document.getElementById("nivel").addEventListener("input", renderizarPreviewCarta);
document.getElementById("raridade").addEventListener("change", renderizarPreviewCarta);
document.getElementById("data").addEventListener("change", renderizarPreviewCarta);


// ======================================================
// SALVAR POKÉMON
// ======================================================

async function salvarPokemon() {

  // Captura treinador
  const treinador = document.getElementById("treinador").value;

  // Captura dados da carta
  const nivel = document.getElementById("nivel").value;
  const raridade = document.getElementById("raridade").value;
  const data = document.getElementById("data").value;

  // Validação
  if (!pokemonSelecionado || !treinador || !nivel || !raridade || !data) {
    mostrarMensagem("Escolha um Pokémon e preencha todos os campos.");
    return;
  }

  // Objeto enviado ao Supabase
  const pokemon = {
    user_id: getUserId(),
    treinador_id: Number(treinador),
    pokemon_api_id: pokemonSelecionado.id,
    nome: pokemonSelecionado.nome,
    tipo: pokemonSelecionado.tipo,
    nivel: Number(nivel),
    raridade,
    data_captura: data,
    imagem_url: pokemonSelecionado.imagem
  };

  // Requisição POST
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/pokemons`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(pokemon)
    }
  );

  // Verifica erro
  if (!response.ok) {
    mostrarMensagem("Erro ao salvar Pokémon.");
    return;
  }

  // Limpa formulário
  limparFormulario();

  // Atualiza cartas
  carregarPokemons();

  mostrarMensagem("Carta criada e enviada para o treinador.");
}


// ======================================================
// LISTAR CARTAS CRIADAS
// ======================================================

async function carregarPokemons() {

  // Busca Pokémons com treinador relacionado
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/pokemons?select=*,treinadores(nome)&order=id.desc`,
    {
      method: "GET",
      headers: getHeaders()
    }
  );

  // Converte resposta
  const pokemons = await response.json();

  // Área da lista
  const lista = document.getElementById("listaPokemons");

  // Limpa lista
  lista.innerHTML = "";

  // Cria cartas
  pokemons.forEach(pokemon => {

    lista.innerHTML += criarHtmlCarta(
      pokemon.nome,
      pokemon.tipo,
      pokemon.nivel,
      pokemon.raridade,
      pokemon.data_captura,
      pokemon.imagem_url,
      pokemon.treinadores?.nome || "Sem treinador",
      pokemon.id
    );
  });
}


// ======================================================
// CRIAR HTML DA CARTA
// ======================================================

// ======================================================
// CRIAR CARTA VISUAL
// ======================================================

function criarHtmlCarta(
  nome,
  tipo,
  nivel,
  raridade,
  data,
  imagem,
  treinador,
  id = null
) {

  // Classe visual baseada na raridade
  let classeCarta = "card-comum";
  let badgeClasse = "badge-comum";

  // Comum
  if (raridade === "Comum") {
    classeCarta = "card-comum";
    badgeClasse = "badge-comum";
  }

  // Raro
  if (raridade === "Raro") {
    classeCarta = "card-raro";
    badgeClasse = "badge-raro";
  }

  // Épico
  if (raridade === "Épico") {
    classeCarta = "card-epico";
    badgeClasse = "badge-epico";
  }

  // Lendário
  if (raridade === "Lendário") {
    classeCarta = "card-lendario";
    badgeClasse = "badge-lendario";
  }


  // Botões aparecem apenas nas cartas salvas
  const botoes = id ? `

    <button
      onclick="editarPokemon(${id})"
      class="btn-edit-pro w-full mt-3"
    >
      Editar Carta
    </button>

    <button
      onclick="excluirPokemon(${id})"
      class="btn-delete-pro w-full mt-3"
    >
      Excluir Carta
    </button>

  ` : "";


  // HTML final da carta
  return `

    <div class="pokemon-card ${classeCarta}">

      <!-- Efeito brilho -->
      <div class="card-shine"></div>

      <div class="pokemon-card-inner">

        <!-- Cabeçalho -->
        <div class="flex justify-between items-center">

          <h3 class="pokemon-name">
            ${nome}
          </h3>

          <span class="font-bold text-xl">
            NV ${nivel}
          </span>

        </div>


        <!-- Imagem -->
        <img
          src="${imagem}"
          class="pokemon-card-img"
        >


        <!-- Tipo -->
        <div class="pokemon-card-info">
          Tipo: ${tipo}
        </div>


        <!-- Raridade -->
        <div class="pokemon-card-info">

          Raridade:

          <span class="badge-raridade ${badgeClasse}">
            ${raridade}
          </span>

        </div>


        <!-- Captura -->
        <div class="pokemon-card-info">
          Capturado em: ${data}
        </div>


        <!-- Treinador -->
        <div class="pokemon-card-info">
          Treinador: ${treinador}
        </div>


        <!-- Botões -->
        ${botoes}

      </div>

    </div>
  `;
}


// ======================================================
// EXCLUIR POKÉMON
// ======================================================

async function excluirPokemon(id) {

  // Confirmação
  const confirmar = confirm("Deseja excluir esta carta?");

  if (!confirmar) {
    return;
  }

  // DELETE
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/pokemons?id=eq.${id}`,
    {
      method: "DELETE",
      headers: getHeaders()
    }
  );

  if (!response.ok) {
    mostrarMensagem("Erro ao excluir carta.");
    return;
  }

  carregarPokemons();
  mostrarMensagem("Carta excluída.");
}


// ======================================================
// LIMPAR FORMULÁRIO
// ======================================================

function limparFormulario() {

  document.getElementById("buscaPokemon").value = "";
  document.getElementById("pokemonSelect").value = "";
  document.getElementById("treinador").value = "";
  document.getElementById("nivel").value = "";
  document.getElementById("raridade").value = "";
  document.getElementById("data").value = "";

  pokemonSelecionado = null;

  document.getElementById("previewCarta").innerHTML = `
    <p class="text-slate-300 text-center">
      Escolha um Pokémon para visualizar a carta.
    </p>
  `;

  preencherSelectPokemons(listaPokemonAPI);
}


// ======================================================
// FORMATAR NOME
// ======================================================

function formatarNome(nome) {

  // Deixa primeira letra maiúscula
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}