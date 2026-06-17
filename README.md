# 🍺 Cevada — Sistema de Gerenciamento

Aplicação React para gerenciamento de produtos, categorias e usuários da cervejaria **Cevada**.

Projeto desenvolvido para a disciplina de Programação Web — AT2 N2.

---

## 🚀 Funcionalidades

- **Login** — Autenticação com Firebase Auth, controle de sessão e proteção de rotas
- **CRUD de Usuários** — Cadastro, listagem, edição e exclusão de usuários
- **CRUD de Categorias** — Cadastro, listagem, edição e exclusão de categorias de produtos
- **CRUD de Produtos** — Cadastro com chaves estrangeiras (categoria + usuário), listagem, edição e exclusão
- **Relatório com JOIN** — Combinação de Produtos + Categorias + Usuários com filtros por categoria e faixa de preço

---

## 📦 Tecnologias

- **React 19** (Create React App)
- **React Router DOM v7** (rotas e navegação)
- **Firebase Auth** (autenticação)
- **Firebase Firestore** (banco de dados)
- **Context API** (gerenciamento de estado global)
- **localStorage** (persistência local dos CRUDs)

---

## 🛠️ Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+ instalado
- Conta no [Firebase](https://firebase.google.com/) com projeto configurado

### 1. Clone o repositório

```bash
git clone https://github.com/vini-andra/Projeto-AT2-N2-programacao-web.git
cd Projeto-AT2-N2-programacao-web
```

### 2. Configurar o Frontend

```bash
cd frontEnd
npm install
```

Copie o arquivo de exemplo de variáveis de ambiente e preencha com suas credenciais do Firebase:

```bash
cp .env.example .env
```

Edite o `.env` com as chaves do seu projeto Firebase:

```
REACT_APP_FIREBASE_API_KEY=sua-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu-projeto
REACT_APP_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXX
```

### 3. Configurar o Backend

```bash
cd ../backEnd
npm install
```

Copie e configure o `.env` do backend:

```bash
cp .env.exemplo .env
```

### 4. Rodar a aplicação

Em um terminal, inicie o backend:

```bash
cd backEnd
node index.js
```

Em outro terminal, inicie o frontend:

```bash
cd frontEnd
npm start
```

O frontend estará disponível em: **http://localhost:3000**

---

## 🔑 Credenciais de Teste

| Campo | Valor |
|-------|-------|
| E-mail | `admin@email.com` |
| Senha | `1234` |

> **Nota:** Na primeira tentativa de login, o sistema cria automaticamente o usuário no Firebase Auth.

---

## 📂 Estrutura do Projeto

```
Projeto-AT2-N2-programacao-web/
├── frontEnd/
│   └── src/
│       ├── components/        # Componentes reutilizáveis
│       │   ├── Layout/        # Layout principal (Navbar + Footer)
│       │   ├── Shared/        # Navbar e Footer
│       │   └── common/        # GenericTable, Button, InputField, Modal
│       ├── context/           # Context API (AuthContext)
│       ├── pages/             # Páginas da aplicação
│       │   ├── Login/         # Sistema de Login
│       │   ├── Dashboard/     # Painel administrativo
│       │   ├── Users/         # CRUD de Usuários
│       │   ├── Categories/    # CRUD de Categorias
│       │   ├── Products/      # CRUD de Produtos
│       │   └── Reports/       # Relatório com JOIN
│       ├── routes/            # Configuração de rotas + ProtectedRoute
│       ├── services/          # Firebase config + API service
│       └── styles/            # CSS global e tema Cevada
├── backEnd/
│   ├── index.js               # Servidor Express
│   └── src/
│       ├── config/            # Configuração do banco
│       ├── controllers/       # Controladores da API
│       ├── routes/            # Rotas do backend
│       └── services/          # Firebase config + Data service
└── README.md
```

---

## 📊 Entidades e Relacionamentos

| Entidade | Campos | Chave no localStorage |
|----------|--------|-----------------------|
| **Usuários** | id, nome, email, telefone | `cevada_usuarios` |
| **Categorias** | id, nome, descricao | `cevada_categorias` |
| **Produtos** | id, nome, preco, categoriaId, usuarioId | `cevada_produtos` |

**Relacionamentos (JOIN):**
- `Produto.categoriaId` → `Categoria.id` (qual categoria o produto pertence)
- `Produto.usuarioId` → `Usuário.id` (quem cadastrou o produto)

---

## 👥 Equipe

Projeto desenvolvido por 6 integrantes para a disciplina de Programação Web.

---

## 📄 Licença

Projeto acadêmico — uso educacional.
