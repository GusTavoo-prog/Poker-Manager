// ======================================================
// PROTEÇÃO DA PÁGINA
// ======================================================

protegerPagina();


// ======================================================
// CARREGAMENTO INICIAL
// ======================================================

carregarTreinadoresDashboard();


// ======================================================
// LISTAR TREINADORES NO DASHBOARD
// ======================================================

async function carregarTreinadoresDashboard() {

  const area = document.getElementById("dashboardTreinadores");

  area.innerHTML = "";

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/treinadores?select=*&order=id.desc`,
    {
      method: "GET",
      headers: getHeaders()
    }
  );

  if (!response.ok) {
    const erro = await response.json();
    console.log("Erro dashboard:", erro);
    mostrarMensagem("Erro ao carregar treinadores no dashboard.", "error");
    return;
  }

  const treinadores = await response.json();

  if (treinadores.length === 0) {
    area.innerHTML = `
      <div class="card-pokemon text-center">
        <p class="text-slate-300 mb-4">
          Nenhum treinador cadastrado ainda.
        </p>

        <a href="treinadores.html" class="btn-yellow inline-block">
          Criar primeiro treinador
        </a>
      </div>
    `;
    return;
  }

  for (const treinador of treinadores) {

    const totalPokemons = await contarPokemonsDoTreinador(treinador.id);

    area.innerHTML += `
      <div onclick="abrirTreinador(${treinador.id})" class="dashboard-trainer-card">

        <img
          src="${treinador.avatar_url || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'}"
        >

        <h4 class="text-2xl font-bold text-yellow-300 mb-2">
          ${treinador.nome}
        </h4>

        <p class="text-slate-300">
          Nível ${treinador.nivel}
        </p>

        <p class="text-slate-300">
          ${totalPokemons} Pokémons capturados
        </p>

      </div>
    `;
  }
}


// ======================================================
// CONTAR POKÉMONS DO TREINADOR
// ======================================================

async function contarPokemonsDoTreinador(treinadorId) {

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/pokemons?treinador_id=eq.${treinadorId}&select=id`,
    {
      method: "GET",
      headers: getHeaders()
    }
  );

  if (!response.ok) {
    return 0;
  }

  const pokemons = await response.json();

  return pokemons.length;
}


// ======================================================
// ABRIR PERFIL DO TREINADOR
// ======================================================

function abrirTreinador(id) {
  window.location.href = `treinador.html?id=${id}`;
}