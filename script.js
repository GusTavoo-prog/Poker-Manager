const SUPABASE_URL = "https://fdylqpqrhlrurxtfeken.supabase.co";
const SUPABASE_KEY = "sb_publishable_XQu7TTdTumlr3idzcb-Hzw_1Nkb2JHx";

let accessToken = localStorage.getItem("accessToken");
let userId = localStorage.getItem("userId");

const authSection = document.getElementById("authSection");
const dashboard = document.getElementById("dashboard");
const btnLogout = document.getElementById("btnLogout");

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

function headers() {
  return {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };
}

function checkSession() {
  if (accessToken && userId) {
    authSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
    btnLogout.classList.remove("hidden");
    carregarTudo();
  } else {
    authSection.classList.remove("hidden");
    dashboard.classList.add("hidden");
    btnLogout.classList.add("hidden");
  }
}

document.getElementById("btnSignup").addEventListener("click", async () => {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) {
    showToast("Preencha email e senha.");
    return;
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    showToast(data.msg || data.error_description || "Erro ao cadastrar.");
    return;
  }

  showToast("Conta criada com sucesso. Agora faça login.");
});

document.getElementById("btnLogin").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showToast("Preencha email e senha.");
    return;
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    showToast(data.error_description || "Erro ao fazer login.");
    return;
  }

  accessToken = data.access_token;
  userId = data.user.id;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("userId", userId);

  showToast("Login realizado com sucesso.");
  checkSession();
});

btnLogout.addEventListener("click", () => {
  localStorage.clear();
  accessToken = null;
  userId = null;
  checkSession();
  showToast("Você saiu do sistema.");
});

document.getElementById("btnSalvarTreinador").addEventListener("click", async () => {
  const nome = document.getElementById("treinadorNome").value;
  const cidade = document.getElementById("treinadorCidade").value;
  const nivel = document.getElementById("treinadorNivel").value;
  const equipe = document.getElementById("treinadorEquipe").value;

  if (!nome || !cidade || !nivel || !equipe) {
    showToast("Preencha todos os campos do treinador.");
    return;
  }

  const treinador = {
    user_id: userId,
    nome,
    cidade,
    nivel: Number(nivel),
    equipe
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/treinadores`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(treinador)
  });

  if (!response.ok) {
    showToast("Erro ao salvar treinador.");
    return;
  }

  limparCamposTreinador();
  showToast("Treinador cadastrado.");
  carregarTudo();
});

document.getElementById("btnSalvarPokemon").addEventListener("click", async () => {
  const treinador_id = document.getElementById("pokemonTreinador").value;
  const nome = document.getElementById("pokemonNome").value;
  const tipo = document.getElementById("pokemonTipo").value;
  const nivel = document.getElementById("pokemonNivel").value;
  const raridade = document.getElementById("pokemonRaridade").value;
  const data_captura = document.getElementById("pokemonData").value;

  if (!treinador_id || !nome || !tipo || !nivel || !raridade || !data_captura) {
    showToast("Preencha todos os campos do Pokémon.");
    return;
  }

  const pokemon = {
    user_id: userId,
    treinador_id: Number(treinador_id),
    nome,
    tipo,
    nivel: Number(nivel),
    raridade,
    data_captura
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/pokemons`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(pokemon)
  });

  if (!response.ok) {
    showToast("Erro ao salvar Pokémon.");
    return;
  }

  limparCamposPokemon();
  showToast("Pokémon cadastrado.");
  carregarTudo();
});

async function carregarTudo() {
  await carregarTreinadores();
  await carregarPokemons();
}

async function carregarTreinadores() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/treinadores?select=*&order=id.desc`, {
    method: "GET",
    headers: headers()
  });

  const treinadores = await response.json();

  const lista = document.getElementById("listaTreinadores");
  const select = document.getElementById("pokemonTreinador");

  lista.innerHTML = "";
  select.innerHTML = `<option value="">Selecione o treinador</option>`;

  treinadores.forEach(treinador => {
    lista.innerHTML += `
      <div class="card">
        <h4>${treinador.nome}</h4>
        <p><strong>Cidade:</strong> ${treinador.cidade}</p>
        <p><strong>Nível:</strong> ${treinador.nivel}</p>
        <p><strong>Equipe:</strong> ${treinador.equipe}</p>

        <div class="mt-4">
          <button class="btn-edit" onclick="editarTreinador(${treinador.id}, '${treinador.nome}', '${treinador.cidade}', ${treinador.nivel}, '${treinador.equipe}')">
            Editar
          </button>
          <button class="btn-delete" onclick="excluirTreinador(${treinador.id})">
            Excluir
          </button>
        </div>
      </div>
    `;

    select.innerHTML += `
      <option value="${treinador.id}">${treinador.nome}</option>
    `;
  });
}

async function carregarPokemons() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/pokemons?select=*,treinadores(nome)&order=id.desc`, {
    method: "GET",
    headers: headers()
  });

  const pokemons = await response.json();

  const lista = document.getElementById("listaPokemons");
  lista.innerHTML = "";

  pokemons.forEach(pokemon => {
    lista.innerHTML += `
      <div class="card">
        <h4>${pokemon.nome}</h4>
        <p><strong>Tipo:</strong> ${pokemon.tipo}</p>
        <p><strong>Nível:</strong> ${pokemon.nivel}</p>
        <p><strong>Raridade:</strong> ${pokemon.raridade}</p>
        <p><strong>Captura:</strong> ${pokemon.data_captura}</p>
        <p><strong>Treinador:</strong> ${pokemon.treinadores?.nome || "Não informado"}</p>

        <div class="mt-4">
          <button class="btn-edit" onclick="editarPokemon(${pokemon.id})">
            Editar
          </button>
          <button class="btn-delete" onclick="excluirPokemon(${pokemon.id})">
            Excluir
          </button>
        </div>
      </div>
    `;
  });
}

async function editarTreinador(id, nomeAtual, cidadeAtual, nivelAtual, equipeAtual) {
  const nome = prompt("Novo nome:", nomeAtual);
  const cidade = prompt("Nova cidade:", cidadeAtual);
  const nivel = prompt("Novo nível:", nivelAtual);
  const equipe = prompt("Nova equipe:", equipeAtual);

  if (!nome || !cidade || !nivel || !equipe) return;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/treinadores?id=eq.${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({
      nome,
      cidade,
      nivel: Number(nivel),
      equipe
    })
  });

  if (!response.ok) {
    showToast("Erro ao editar treinador.");
    return;
  }

  showToast("Treinador atualizado.");
  carregarTudo();
}

async function editarPokemon(id) {
  const nome = prompt("Novo nome do Pokémon:");
  const tipo = prompt("Novo tipo:");
  const nivel = prompt("Novo nível:");
  const raridade = prompt("Nova raridade:");

  if (!nome || !tipo || !nivel || !raridade) return;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/pokemons?id=eq.${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({
      nome,
      tipo,
      nivel: Number(nivel),
      raridade
    })
  });

  if (!response.ok) {
    showToast("Erro ao editar Pokémon.");
    return;
  }

  showToast("Pokémon atualizado.");
  carregarTudo();
}

async function excluirTreinador(id) {
  const confirmar = confirm("Deseja excluir este treinador? Os Pokémons ligados a ele também serão excluídos.");

  if (!confirmar) return;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/treinadores?id=eq.${id}`, {
    method: "DELETE",
    headers: headers()
  });

  if (!response.ok) {
    showToast("Erro ao excluir treinador.");
    return;
  }

  showToast("Treinador excluído.");
  carregarTudo();
}

async function excluirPokemon(id) {
  const confirmar = confirm("Deseja excluir este Pokémon?");

  if (!confirmar) return;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/pokemons?id=eq.${id}`, {
    method: "DELETE",
    headers: headers()
  });

  if (!response.ok) {
    showToast("Erro ao excluir Pokémon.");
    return;
  }

  showToast("Pokémon excluído.");
  carregarTudo();
}

function limparCamposTreinador() {
  document.getElementById("treinadorNome").value = "";
  document.getElementById("treinadorCidade").value = "";
  document.getElementById("treinadorNivel").value = "";
  document.getElementById("treinadorEquipe").value = "";
}

function limparCamposPokemon() {
  document.getElementById("pokemonTreinador").value = "";
  document.getElementById("pokemonNome").value = "";
  document.getElementById("pokemonTipo").value = "";
  document.getElementById("pokemonNivel").value = "";
  document.getElementById("pokemonRaridade").value = "";
  document.getElementById("pokemonData").value = "";
}

checkSession();