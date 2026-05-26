// ======================================================
// CONFIGURAÇÕES GERAIS DO SUPABASE
// ======================================================

// URL do projeto criado no Supabase
const SUPABASE_URL = "https://fdylqpqrhlrurxtfeken.supabase.co";

// Chave pública do projeto Supabase
const SUPABASE_KEY = "sb_publishable_XQu7TTdTumlr3idzcb-Hzw_1Nkb2JHx";


// ======================================================
// FUNÇÕES DE SESSÃO
// ======================================================

// Retorna o token salvo no navegador após o login
function getToken() {
  return localStorage.getItem("accessToken");
}

// Retorna o ID do usuário logado
function getUserId() {
  return localStorage.getItem("userId");
}


// ======================================================
// FUNÇÃO PARA MONTAR CABEÇALHOS DA API
// ======================================================

// Essa função monta os cabeçalhos obrigatórios
// usados nas requisições para o Supabase REST API
function getHeaders() {
  return {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${getToken()}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };
}


// ======================================================
// PROTEÇÃO DE PÁGINAS
// ======================================================

// Verifica se o usuário está logado.
// Caso não esteja, ele é redirecionado
// automaticamente para a tela de login.
function protegerPagina() {
  if (!getToken() || !getUserId()) {
    window.location.href = "login.html";
  }
}


// ======================================================
// LOGOUT
// ======================================================

// Remove os dados do login salvos no navegador
// e volta para a tela inicial de login.
function sair() {
  localStorage.clear();
  window.location.href = "login.html";
}