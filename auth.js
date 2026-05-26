// ======================================================
// FUNÇÃO DE CADASTRO DE USUÁRIO
// ======================================================

// Essa função cria uma nova conta no Supabase
async function criarConta() {

  // Captura os valores digitados nos inputs
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  // Elemento onde as mensagens serão exibidas
  const mensagem = document.getElementById("mensagem");

  // Verifica se os campos estão preenchidos
  if (!email || !password) {
    mensagem.textContent = "Preencha email e senha.";
    return;
  }

  // Faz requisição para API de autenticação do Supabase
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {

    // Método POST envia dados para criação
    method: "POST",

    // Cabeçalhos da requisição
    headers: {
      "apikey": SUPABASE_KEY,
      "Content-Type": "application/json"
    },

    // Dados enviados para API
    body: JSON.stringify({
      email,
      password
    })
  });

  // Converte resposta para JSON
  const data = await response.json();

  // Verifica se houve erro
  if (!response.ok) {

    // Exibe erro retornado pelo Supabase
    mensagem.textContent =
      data.msg ||
      data.error_description ||
      "Erro ao cadastrar.";

    return;
  }

  // Mensagem de sucesso
  mensagem.textContent =
    "Conta criada com sucesso. Agora faça login.";
}



// ======================================================
// FUNÇÃO DE LOGIN
// ======================================================

// Realiza autenticação do usuário
async function login() {

  // Captura email digitado
  const email = document.getElementById("loginEmail").value;

  // Captura senha digitada
  const password = document.getElementById("loginPassword").value;

  // Elemento de mensagem da tela
  const mensagem = document.getElementById("mensagem");

  // Verifica campos vazios
  if (!email || !password) {
    mensagem.textContent = "Preencha email e senha.";
    return;
  }

  // Faz login usando API do Supabase
  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {

      method: "POST",

      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email,
        password
      })
    }
  );

  // Converte resposta para JSON
  const data = await response.json();

  // Caso login falhe
  if (!response.ok) {

    mensagem.textContent =
      data.error_description ||
      "Erro no login. Verifique email e senha.";

    return;
  }

  // Salva token do usuário no navegador
  localStorage.setItem(
    "accessToken",
    data.access_token
  );

  // Salva ID do usuário logado
  localStorage.setItem(
    "userId",
    data.user.id
  );

  // Redireciona para dashboard
  window.location.href = "dashboard.html";
}