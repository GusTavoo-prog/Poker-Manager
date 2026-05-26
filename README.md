# 🎮 PokéManager

Sistema web completo de gerenciamento de treinadores e cartas Pokémon desenvolvido utilizando HTML, CSS, JavaScript, Tailwind CSS e Supabase.

O projeto foi desenvolvido com foco em uma interface moderna, responsiva e interativa, permitindo o gerenciamento de treinadores, criação de cartas Pokémon personalizadas e visualização de perfis individuais.

---

# 📚 Objetivo do Projeto

O objetivo do sistema é simular uma Pokédex moderna, permitindo:

- cadastro de usuários;
- autenticação/login;
- criação de treinadores;
- captura de Pokémons;
- geração automática de cartas;
- visualização de perfis;
- armazenamento em banco de dados online.

O projeto utiliza integração com Supabase através de API REST e operações assíncronas utilizando JavaScript.

---

# 🧩 Funcionalidades do Sistema

## 🔐 Sistema de Login

- Cadastro de usuários
- Login autenticado
- Sessão protegida
- Logout

---

## 👤 Gerenciamento de Treinadores

- Criar treinador
- Editar treinador
- Excluir treinador
- Escolher avatar do anime Pokémon
- Visualizar perfil completo

Cada treinador possui:
- nome;
- cidade;
- equipe;
- nível;
- avatar personalizado.

---

## 🎴 Sistema de Cartas Pokémon

- Captura de Pokémons
- Geração automática de cartas
- Cartas personalizadas por raridade
- Sistema visual inspirado em TCG Pokémon
- Visualização das cartas por treinador

---

## 🌟 Sistema de Raridade

As cartas mudam automaticamente de aparência conforme a raridade:

| Raridade | Cor |
|---|---|
| Comum | Azul |
| Raro | Verde |
| Épico | Roxo |
| Lendário | Dourado |

---

## 📊 Dashboard

O dashboard principal permite:

- visualizar treinadores cadastrados;
- acessar perfis individuais;
- navegar entre páginas;
- acessar rapidamente criação de treinador e Pokémon.

---

# 🎨 Interface e Design

O sistema foi desenvolvido com:

✅ Interface responsiva  
✅ Tema Pokémon  
✅ Animações  
✅ Loading screen  
✅ Pokédex lateral  
✅ Cartas estilizadas  
✅ Efeitos holográficos  
✅ Fundo animado  
✅ Cards interativos  

---

# 🚀 Tecnologias Utilizadas

## Frontend
- HTML5
- CSS3
- JavaScript

## Estilização
- Tailwind CSS

## Backend/Banco
- Supabase

## API
- REST API

---

# 🗂 Estrutura do Projeto

```txt
poke-manager/
│
├── login.html
├── dashboard.html
├── treinadores.html
├── pokemons.html
├── treinador.html
│
├── style.css
│
├── config.js
├── auth.js
├── dashboard.js
├── treinador.js
├── treinadores.js
├── pokemons.js
├── utils.js
│
├── img/
│   ├── ash.png
│   ├── misty.png
│   ├── brock.png
│   ├── tracey.png
│   ├── may.png
│   ├── dawn.png
│   └── serena.png
│
└── README.md