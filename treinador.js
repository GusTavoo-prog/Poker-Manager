// Protege a página
protegerPagina();

// Pega o ID do treinador que veio pela URL
const params = new URLSearchParams(window.location.search);
const treinadorId = params.get("id");

// Carrega tudo ao abrir a página
carregarPerfilTreinador();
carregarCartasTreinador();


// Busca e mostra os dados do treinador
async function carregarPerfilTreinador() {

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/treinadores?id=eq.${treinadorId}&select=*`,
    {
      method: "GET",
      headers: getHeaders()
    }
  );

  if (!response.ok) {
    mostrarMensagem("Erro ao carregar treinador.", "error");
    return;
  }

  const dados = await response.json();
  const treinador = dados[0];

  const perfil = document.getElementById("perfilTreinador");

  perfil.innerHTML = `
    <div class="text-center">

      <img
        src="${treinador.avatar_url}"
        class="trainer-profile-avatar"
      >

      <h1 class="text-5xl font-bold text-yellow-300 mt-4 mb-3">
        ${treinador.nome}
      </h1>

      <div class="grid md:grid-cols-3 gap-4 mt-6">

        <div class="profile-info-box">
          <p>Cidade</p>
          <strong>${treinador.cidade}</strong>
        </div>

        <div class="profile-info-box">
          <p>Equipe</p>
          <strong>${treinador.equipe}</strong>
        </div>

        <div class="profile-info-box">
          <p>Nível</p>
          <strong>${treinador.nivel}</strong>
        </div>

      </div>

      <a href="pokemons.html" class="btn-yellow inline-block mt-8">
        Capturar novo Pokémon
      </a>

    </div>
  `;
}


// Busca e mostra todas as cartas desse treinador
async function carregarCartasTreinador() {

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/pokemons?treinador_id=eq.${treinadorId}&select=*&order=id.desc`,
    {
      method: "GET",
      headers: getHeaders()
    }
  );

  if (!response.ok) {
    mostrarMensagem("Erro ao carregar cartas.", "error");
    return;
  }

  const pokemons = await response.json();

  const area = document.getElementById("cartasTreinador");

  area.innerHTML = "";

  if (pokemons.length === 0) {
    area.innerHTML = `
      <div class="card-pokemon text-center">
        <p class="text-slate-300 mb-5">
          Este treinador ainda não possui cartas cadastradas.
        </p>

        <a href="pokemons.html" class="btn-yellow inline-block">
          Criar primeira carta
        </a>
      </div>
    `;
    return;
  }

  pokemons.forEach(pokemon => {
    area.innerHTML += criarCartaPerfil(pokemon);
  });
}


// Cria a carta visual na página do treinador
function criarCartaPerfil(pokemon) {

  let classeCarta = "card-comum";
  let badgeClasse = "badge-comum";

  if (pokemon.raridade === "Comum") {
    classeCarta = "card-comum";
    badgeClasse = "badge-comum";
  }

  if (pokemon.raridade === "Raro") {
    classeCarta = "card-raro";
    badgeClasse = "badge-raro";
  }

  if (pokemon.raridade === "Épico") {
    classeCarta = "card-epico";
    badgeClasse = "badge-epico";
  }

  if (pokemon.raridade === "Lendário") {
    classeCarta = "card-lendario";
    badgeClasse = "badge-lendario";
  }

  return `
    <div class="pokemon-card ${classeCarta}">

      <div class="card-shine"></div>

      <div class="pokemon-card-inner">

        <div class="flex justify-between items-center">
          <h3 class="pokemon-name">${pokemon.nome}</h3>
          <span class="font-bold text-xl">NV ${pokemon.nivel}</span>
        </div>

        <img
          src="${pokemon.imagem_url}"
          class="pokemon-card-img"
        >

        <div class="pokemon-card-info">
          Tipo: ${pokemon.tipo}
        </div>

        <div class="pokemon-card-info">
          Raridade:
          <span class="badge-raridade ${badgeClasse}">
            ${pokemon.raridade}
          </span>
        </div>

        <div class="pokemon-card-info">
          Capturado em: ${pokemon.data_captura}
        </div>

      </div>
    </div>
  `;
}