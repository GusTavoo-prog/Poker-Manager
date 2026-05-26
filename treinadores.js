// ======================================================
// PROTEÇÃO
// ======================================================

// Permite apenas usuários logados
protegerPagina();


// ======================================================
// VARIÁVEL GLOBAL
// ======================================================

// Guarda o avatar escolhido
let avatarSelecionado = "";


// ======================================================
// CARREGAMENTO INICIAL
// ======================================================

// Carrega lista de treinadores
carregarTreinadores();


// ======================================================
// SELECIONAR AVATAR
// ======================================================

// Marca avatar selecionado
function selecionarAvatar(card, url) {

  // Remove seleção anterior
  document.querySelectorAll(".avatar-card").forEach(item => {
    item.classList.remove("selected");
  });

  // Adiciona seleção atual
  card.classList.add("selected");

  // Salva URL do avatar
  avatarSelecionado = url;
}


// ======================================================
// SALVAR TREINADOR
// ======================================================

async function salvarTreinador() {

  // Captura dados do formulário
  const nome = document.getElementById("nome").value;
  const cidade = document.getElementById("cidade").value;
  const nivel = document.getElementById("nivel").value;
  const equipe = document.getElementById("equipe").value;

  // Validação
  if (!nome || !cidade || !nivel || !equipe || !avatarSelecionado) {

    mostrarMensagem("Preencha todos os campos e escolha um avatar.");

    return;
  }

  // Objeto enviado para Supabase
  const treinador = {
    user_id: getUserId(),
    nome,
    cidade,
    nivel: Number(nivel),
    equipe,
    avatar_url: avatarSelecionado
  };

  // Requisição POST
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/treinadores`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(treinador)
    }
  );

  // Verifica erro
  if (!response.ok) {

  const erro = await response.json();

  console.log("Erro Supabase:", erro);

  mostrarMensagem("Erro ao criar treinador: " + erro.message, "error");

  return;
}
  // Limpa formulário
  limparFormulario();

  // Atualiza lista
  carregarTreinadores();

  mostrarMensagem("Treinador criado.");
}


// ======================================================
// LISTAR TREINADORES
// ======================================================

async function carregarTreinadores() {

  // Busca treinadores e pokémons relacionados
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/treinadores?select=*,pokemons(id)&order=id.desc`,
    {
      method: "GET",
      headers: getHeaders()
    }
  );

  // Converte resposta
  const treinadores = await response.json();

  // Área da lista
  const lista = document.getElementById("listaTreinadores");

  // Limpa área
  lista.innerHTML = "";

  // Cria os cards
  treinadores.forEach(treinador => {

    // Quantidade de Pokémons
    const totalPokemons =
      treinador.pokemons ? treinador.pokemons.length : 0;

    lista.innerHTML += `

      <div class="trainer-box">

        <!-- Avatar -->
        <img
          onclick="abrirTreinador(${treinador.id})"
          src="${treinador.avatar_url}"
          class="trainer-avatar"
        >

        <!-- Nome -->
        <h3 class="text-2xl font-bold text-yellow-300 mb-2">
          ${treinador.nome}
        </h3>

        <!-- Informações -->
        <p class="text-slate-300">
          Nível ${treinador.nivel}
        </p>

        <p class="text-slate-300 mb-4">
          ${totalPokemons} Pokémons
        </p>

        <!-- Botões -->
        <div class="flex gap-3">

          <button
            onclick="editarTreinador(
              ${treinador.id},
              '${treinador.nome}',
              '${treinador.cidade}',
              ${treinador.nivel},
              '${treinador.equipe}'
            )"
            class="btn-edit-pro w-full"
          >
            Editar
          </button>

          <button
            onclick="excluirTreinador(${treinador.id})"
            class="btn-delete-pro w-full"
          >
            Excluir
          </button>

        </div>

      </div>
    `;
  });
}


// ======================================================
// ABRIR PERFIL
// ======================================================

// Vai para a página do treinador
function abrirTreinador(id) {
  window.location.href = `treinador.html?id=${id}`;
}


// ======================================================
// EDITAR TREINADOR
// ======================================================

async function editarTreinador(
  id,
  nomeAtual,
  cidadeAtual,
  nivelAtual,
  equipeAtual
) {

  const nome =
    prompt("Novo nome:", nomeAtual);

  const cidade =
    prompt("Nova cidade:", cidadeAtual);

  const nivel =
    prompt("Novo nível:", nivelAtual);

  const equipe =
    prompt("Nova equipe:", equipeAtual);

  if (!nome || !cidade || !nivel || !equipe) {
    return;
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/treinadores?id=eq.${id}`,
    {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({
        nome,
        cidade,
        nivel: Number(nivel),
        equipe
      })
    }
  );

  if (!response.ok) {

    mostrarMensagem("Erro ao editar treinador.");

    return;
  }

  carregarTreinadores();

  mostrarMensagem("Treinador atualizado.");
}


// ======================================================
// EXCLUIR TREINADOR
// ======================================================

async function excluirTreinador(id) {

  const confirmar =
    confirm("Deseja excluir este treinador?");

  if (!confirmar) {
    return;
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/treinadores?id=eq.${id}`,
    {
      method: "DELETE",
      headers: getHeaders()
    }
  );

  if (!response.ok) {

    mostrarMensagem("Erro ao excluir treinador.");

    return;
  }

  carregarTreinadores();

  mostrarMensagem("Treinador removido.");
}


// ======================================================
// LIMPAR FORMULÁRIO
// ======================================================

function limparFormulario() {

  document.getElementById("nome").value = "";

  document.getElementById("cidade").value = "";

  document.getElementById("nivel").value = "";

  document.getElementById("equipe").value = "";

  avatarSelecionado = "";

  // Remove seleção visual
  document.querySelectorAll(".avatar-card").forEach(item => {
    item.classList.remove("selected");
  });
}