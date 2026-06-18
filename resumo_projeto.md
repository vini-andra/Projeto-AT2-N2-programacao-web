# Documentação Técnica e Funcional: Mapeamento Detalhado do Sistema Cevada

Este documento explica de forma exaustiva a **função interna de cada arquivo** e como as tecnologias estão implementadas linha a linha, detalhando as funções de cada módulo.

---

## 1. Arquitetura Geral do Sistema
O sistema adota o padrão de **3 Camadas**, garantindo segurança e escalabilidade:
1. **Frontend (React - Porta 3000):** Desenha as telas, lida com formulários e estado local. Ele nunca grava no banco diretamente, sempre pedindo permissão ao backend.
2. **Backend (Express Node.js - Porta 5000):** É o cérebro. Recebe a requisição web, valida as regras e envia o comando para a nuvem.
3. **Database (Firebase Firestore):** Base de dados em nuvem da Google.

---

## 2. Mapeamento Interno do Backend (`/backEnd`)

O backend foi arquitetado com base no padrão MVC (sem as Views visuais) focado em Controladores e Serviços.

### 2.1 `index.js` (O Ponto de Partida)
- **O que faz:** Inicializa a API inteira.
- **Funções/Código interno:**
  - `require('dotenv').config()`: Carrega segredos ocultos no arquivo `.env`.
  - `app.use(cors())`: Libera a comunicação cruzada. Sem isso, o Google Chrome bloqueia o React (porta 3000) de falar com o Node (porta 5000).
  - `connectDB()`: Chama o arquivo de configuração para conectar aos servidores da Google (Firebase).
  - `app.use('/api', dataRoutes)`: Diz ao servidor que qualquer URL que comece com `/api` será gerida pelos arquivos de rotas.

### 2.2 `src/config/firebaseConfig.js`
- **O que faz:** Autentica o código no projeto do Firebase.
- **Funções/Código interno:** Executa `initializeApp()` da biblioteca do Firebase passando as chaves (API Key, Project ID). Exporta a constante `db` que representa a ponte aberta com o banco.

### 2.3 `src/controllers/authController.js`
- **O que faz:** Regras do Login.
- **Funções internas (`exports.login`):**
  - Recebe um `email` e um `idToken` (que o frontend mandou).
  - Usa a biblioteca `jsonwebtoken` e `jwks-rsa` para verificar criptograficamente se aquele Token foi emitido pela Google.
  - Verifica se o e-mail descriptografado do Token bate com o e-mail mandado. Se bater, retorna `success: true`.

### 2.4 `src/controllers/dataController.js` (O Coração Genérico)
- **O que faz:** Abstrai todas as regras de negócio de salvar/ler informações, não importando qual é a tabela. Usa o "Factory Pattern".
- **Funções internas:**
  - `getAll(collectionName)`: Retorna uma função que executa `fetchAll()` do serviço. Retorna um JSON para o frontend.
  - `create(collectionName)`: Valida se o `req.body` não está vazio e chama `createItem()` do serviço. Retorna Status 201.
  - `update(collectionName)` e `remove(collectionName)`: Exigem um parâmetro `:id` e repassam para o serviço.

### 2.5 `src/services/dataService.js` (A Camada de Dados Real)
- **O que faz:** O único arquivo no projeto inteiro do backend que sabe comandos do banco de dados Firebase.
- **Funções internas:**
  - `fetchAll()`: Roda o comando `getDocs()` do Firestore. Mapeia os dados devolvendo um array de objetos puros injetando a chave primária (`id: d.id`).
  - `createItem()`: Roda o `addDoc()`. Se der falha (Firebase offline), ele lança um `throw error` propositalmente para o Controller avisar a tela (Frontend) que deu errado.

### 2.6 `src/routes/dataRoutes.js` (Fábrica de Rotas)
- **O que faz:** Cria todos os endpoints da API.
- **Funções internas:**
  - Possui um array com strings de tabelas: `const entidades = ['usuarios', 'categorias', 'produtos']`.
  - Executa um loop `forEach`. Para cada nome na lista, ele gera 4 linhas: `router.get`, `router.post`, `router.put`, `router.delete`. Isso poupa centenas de linhas de código copiadas.

---

## 3. Mapeamento Interno do Frontend (`/frontEnd/src`)

O Frontend baseia-se em componentes e estado dinâmico gerenciado pelo React.

### 3.1 `src/services/api.js` (O Carteiro)
- **O que faz:** Centraliza os chamados de rede. Todas as telas (Pages) chamam este arquivo em vez de usar URLs soltas.
- **Funções internas:**
  - `apiGetAll(entidade)`: Faz um `fetch` na URL do backend. Tem uma inteligência de resiliência: se o backend estiver fora do ar (`!response.ok`), ele lança um `Error`. Isso é vital para que as páginas saibam ativar o "Modo Offline".
  - `apiCreate()`, `apiUpdate()`, `apiDelete()`: Repassam JSONs usando os verbos HTTP correspondentes.

### 3.2 `src/context/AuthContext.js` (O Estado Global)
- **O que faz:** Memória principal do app. Lembra quem está logado, para que o sistema inteiro se adapte.
- **Funções internas:**
  - `login()`: Uma das lógicas mais completas. Recebe e-mail/senha. Tenta logar no Firebase Auth (`signInWithEmailAndPassword`). Pega o token, e MANDA PARA A API do Backend para o servidor validar o usuário. Se o Backend validar, ele guarda no `localStorage` e muda o estado global (`setUser`).
  - `useEffect()`: Um hook que executa na abertura do site. Ele pesca os dados no `localStorage` para você não ter que logar de novo só porque atualizou a página (F5).

### 3.3 `src/routes/AppRouter.js` e `ProtectedRoute.js` (Roteamento Seguro)
- **O que fazem:** Trocam as páginas visíveis de acordo com a URL (ex: `/dashboard`), e blindam páginas secretas.
- **Como funciona:** O `ProtectedRoute` tenta ler a variável `user` do AuthContext. Se `user` for vazio (não logado), ele usa o componente `<Navigate>` para ejetar o invasor de volta para a tela de Login.

### 3.4 Um Componente de Tela Completo (Ex: `src/pages/Products.js`)
- **O que faz:** Toda a lógica de UI de listar, criar, e deletar Produtos.
- **Funções internas:**
  - **Estado (`useState`):** Guarda os `produtos`, mas também importa as `categorias` e `usuarios` para preencher as caixas de seleção do formulário (Selects - Foreign Keys).
  - **`carregarDados()` (`useEffect`):** Executa assim que a tela abre. Tenta puxar tudo via `api.js`. Se a API lançar erro (backend fora do ar), o bloco `catch` executa e lê silenciosamente do `localStorage.getItem('cevada_produtos')`. Exibe um aviso visual na tela: "Modo Offline".
  - **`handleSubmit()`:** Acionado ao clicar em salvar. Executa validações em tela (ex: preço menor que zero). Se for novo, chama `apiCreate`. Se passar, injeta a resposta na variável de produtos da tela, fechando o form e atualizando a tabela visualmente no mesmo segundo.

### 3.5 O Relatório Avançado (`src/pages/Reports.js`)
- **O que faz:** Cruza dados (Join) para exibir uma visão gerencial de tudo o que está rodando.
- **Função de Alta Performance Interna:** 
  - Para juntar dados de Produtos, Usuários e Categorias, a tela poderia fazer a lentíssima "requisição em cascata". Em vez disso, usa **`Promise.all([apiGetAll('produtos'), apiGetAll('categorias'), apiGetAll('usuarios')])`**. O navegador vai à rede simultaneamente para todas, dividindo o tempo de carregamento real.
  - Depois pega a Foreign Key e cruza: `categoria: categorias.find(c => c.id === prod.categoriaId).nome`.
  - Novamente, se houver falha de rede fatal, possui um bloco de contenção (`catch`) que acessa o Cache local de todos de uma vez e gera a tabela offline.

---

## 4. O Fluxo Perfeito (Backend e Frontend se unindo)

Se olharmos para o sistema funcionando através destas funções, notamos:
1. O React (`Products.js`) formata os dados e chama o mensageiro (`api.js`).
2. O mensageiro bate na porta do servidor e entrega a encomenda criptografada na rota gerada dinamicamente (`dataRoutes.js`).
3. A regra de negócio (`dataController.js`) autoriza o pacote e delega a missão ao banco (`dataService.js`).
4. O Google Cloud salva. Responde que está salvo. A mensagem volta todo o caminho de trás pra frente e, por fim, o `Products.js` executa uma atualização de estado de tela (`setProdutos`), concluindo o ciclo mágico de forma rápida, tolerante a falhas (resiliente) e esteticamente agradável.
