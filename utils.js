// ======================================================
// MODAL BONITO
// ======================================================

// Cria mensagens modernas no canto da tela
function mostrarMensagem(texto, tipo = "success") {

  // Cria elemento modal
  const modal = document.createElement("div");

  // Define classes
  modal.className = `
    custom-modal
    ${tipo === "success" ? "modal-success" : "modal-error"}
  `;

  // Texto
  modal.innerHTML = texto;

  // Adiciona no body
  document.body.appendChild(modal);

  // Remove automaticamente
  setTimeout(() => {
    modal.remove();
  }, 3000);
}


// ======================================================
// SOM POKÉMON
// ======================================================

// Toca som simples de confirmação
function tocarSom() {

  const audio = new Audio(
    "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg"
  );

  audio.volume = 0.25;

  audio.play();
}