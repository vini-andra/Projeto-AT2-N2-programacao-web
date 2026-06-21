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
- Conta no [Firebase](https://firebase.google.com/) com um projeto criado

### 1. Configurando o Projeto no Firebase Console

Antes de rodar a aplicação, você precisa preparar o seu projeto no Firebase:
1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie um novo projeto (ou use um existente).
2. No menu lateral, vá em **Authentication** > **Sign-in method** (Método de login).
3. Habilite os seguintes provedores:
   - **E-mail/senha**
   - **Google** (adicione o e-mail de suporte solicitado na tela e salve)
4. Vá em **Firestore Database** e clique em "Criar banco de dados". Inicie em modo de teste ou ajuste as regras para permitir leitura/escrita.
5. Acesse as **Configurações do Projeto** (ícone de engrenagem no menu lateral superior) e adicione um aplicativo "Web". Ao final, ele exibirá um objeto chamado `firebaseConfig`. **Guarde essas chaves**, você precisará delas abaixo.

### 2. Clone o repositório

```bash
git clone https://github.com/vini-andra/Projeto-AT2-N2-programacao-web.git
cd Projeto-AT2-N2-programacao-web
```

### 3. Configurar o Backend

```bash
cd backEnd
npm install
```

Copie e configure o `.env` do backend usando o modelo fornecido:

```bash
cp .env.exemplo .env
```

Edite o arquivo `.env` dentro da pasta `backEnd` colando as informações do seu projeto Firebase (aquelas geradas no passo 1):
```env
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=1:123456789:web:
FIREBASE_MEASUREMENT_ID=
PORT=5000
```

### 4. Configurar o Frontend

```bash
cd ../frontEnd
npm install
```

Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

⚠️ **Atenção muito importante**: No React (frontend), todas as variáveis de ambiente **obrigatoriamente** precisam começar com o prefixo `REACT_APP_`. Copie as mesmas chaves do Firebase que você colocou no backend, mas garanta que elas tenham o prefixo na frente:

```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=1:123456789:
REACT_APP_FIREBASE_MEASUREMENT_ID=
```
*(Dica: sempre que você alterar o arquivo `.env` do frontend, é necessário parar o terminal e rodar `npm start` novamente).*

### 5. Rodar a aplicação

Em um terminal, inicie o servidor do backend:

```bash
cd backEnd
npm run dev
# ou node index.js
```
*(Nota: Ao iniciar o backend com o banco de dados vazio, ele fará um auto-seed, populando automaticamente o Firestore com alguns dados fictícios de produtos, categorias e usuários para facilitar os testes).*

Em outro terminal (mantenha o backend rodando), inicie o frontend:

```bash
cd frontEnd
npm start
```

O frontend abrirá automaticamente em: **http://localhost:3000**

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
