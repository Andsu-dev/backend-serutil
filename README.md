# API de Integração ClickUp para teste técnico backend - Ser Útil

API desenvolvida para integração com o ClickUp e sistemas internos referente ao teste de competências da Ser Útil, permitindo sincronização e gerenciamento de tarefas de backlog para suporte de plataforma web.

## 📋 Descrição do Projeto

Esta API atua como um sistema intermediário que conecta os recursos internos com a plataforma ClickUp, proporcionando funcionalidades de:

- Consulta e sincronização de tarefas
- Criação de novas tarefas
- Gerenciamento local de dados
- Tratamento robusto de erros
- Documentação interativa via Swagger

## 🛠 Tecnologias Utilizadas

- **Runtime:** Node.js (latest)
- **Linguagem:** JavaScript
- **Plataforma de Integração:** ClickUp API
- **Banco de Dados:** Firebase
- **Framework:** Express.js
- **Documentação:** Swagger

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js (versão mais recente)
- npm
- Conta no ClickUp (gratuita)

### 1. Clone o repositório

```bash
git clone [URL_DO_REPOSITORIO]
cd [NOME_DO_PROJETO]
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configuração das variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
CLICKUP_API_KEY=seu_token_clickup_aqui
CLICKUP_LIST_ID=id_da_lista_clickup
PORT=3000
```

Como o banco de dados utilizado foi o Firebase, é necessário configurar também as chaves de autenticação:

```env
# Você pode encontrar essas informações no console do Firebase:
# https://console.firebase.google.com/project/_/settings/general

FIREBASE_API_KEY=sua_api_key_aqui
FIREBASE_AUTH_DOMAIN=seu_auth_domain_aqui
FIREBASE_PROJECT_ID=seu_project_id_aqui
FIREBASE_STORAGE_BUCKET=seu_storage_bucket_aqui
FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id_aqui
FIREBASE_APP_ID=seu_app_id_aqui
```

### 4. Configuração do ClickUp

1. Acesse [ClickUp.com](https://clickup.com/) e crie uma conta gratuita
2. Crie um workspace e um projeto
3. Configure uma lista de tarefas de backlog para suporte web
4. Obtenha seu token de API em: Settings > Apps > API
5. Copie o ID da lista de tarefas criada

### 5. Execute a aplicação

```bash
npm run dev
```

## 📚 Documentação da API (Swagger)

A documentação interativa da API está disponível através do Swagger UI. Após iniciar a aplicação, acesse:

```
http://localhost:3000/api-docs
```

O Swagger UI fornece:

- Descrição detalhada de todos os endpoints
- Esquemas de requisição e resposta
- Interface interativa para testar os endpoints
- Exemplos de payloads
- Códigos de status e mensagens de erro

## 🚀 Endpoints da API

### GET /tasks

Consulta todas as tarefas da lista do ClickUp e sincroniza com o armazenamento local.

**Resposta:**

```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "string",
    "start_date": "2024-01-01T00:00:00.000Z",
    "due_date": "2024-01-15T23:59:59.000Z"
  }
]
```

### POST /tasks

Cria uma nova tarefa no ClickUp.

**Body da requisição:**

```json
{
  "name": "Título obrigatório",
  "description": "Descrição opcional",
  "status": "to do",
  "start_date": "2024-01-01T00:00:00.000Z",
  "due_date": "2024-01-15T23:59:59.000Z"
}
```

**Resposta:**

```json
{
  "id": "string"
}
```

### GET /tasks/:id

Consulta uma tarefa específica pelo ID.

**Resposta:**

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "start_date": "2024-01-01T00:00:00.000Z",
  "due_date": "2024-01-15T23:59:59.000Z"
}
```

### DELETE /tasks/:id

Remove uma tarefa do armazenamento local.

**Resposta:**

```json
{
  "message": "Task deleted successfully"
}
```

## 🔄 Funcionalidades Implementadas

### Sincronização Inteligente

- ✅ Consulta todas as tarefas do ClickUp
- ✅ Verifica se a tarefa já existe localmente
- ✅ Atualiza tarefas existentes ou cria novas
- ✅ Armazena: ID, título, descrição, status, data de início e vencimento

### Criação de Tarefas

- ✅ Título obrigatório
- ✅ Campos opcionais: descrição, status, datas
- ✅ Validação de dados de entrada
- ✅ Conversão automática de datas para timestamp

### Gerenciamento Local

- ✅ Exclusão de tarefas do armazenamento interno
- ✅ Preservação das tarefas no ClickUp

### Tratamento de Erros

- ✅ ClickUp indisponível
- ✅ Dados inválidos
- ✅ Requisições inválidas
- ✅ Erros internos
- ✅ Erros na criação com o repositório
- ✅ Mensagens de erro padronizadas

## 🧪 Testes

Execute os testes com:

```bash
npm run test
```

## ⚠️ Considerações Importantes

- A API mantém sincronização unidirecional com o ClickUp para consultas
- Exclusões locais não afetam as tarefas no ClickUp
- Logs detalhados para debugging e monitoramento
- Documentação completa via Swagger

## 🤝 Contribuição

Este projeto foi desenvolvido como teste técnico para a posição de Desenvolvedor Backend - NodeJS na Ser Útil.

## 📞 Contato

Para dúvidas sobre o desenvolvimento:

- **Desenvolvedor:** Anderson Medeiros
- **Email:** alucsm02@gmail.com
- **LinkedIn:** [Anderson Medeiros dev](https://www.linkedin.com/in/anderson-medeiros-dev/)

---

**Nota:** Este projeto foi desenvolvido seguindo as especificações do teste técnico da Ser Útil, com foco em integração de sistemas, boas práticas de desenvolvimento backend e documentação completa da API.
