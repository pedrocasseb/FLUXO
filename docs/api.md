# Documentação da API REST - FLUXO

Esta documentação descreve todos os endpoints REST disponibilizados pela API do sistema **FLUXO**.

---

## 1. Autenticação (`/auth`)

Endpoints públicos para registro e login de usuários.

### 1.1. Cadastrar Usuário
- **Rota:** `POST /auth/register`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "password": "senha_segura_123"
  }
  ```
- **Validação:** `name` obrigatório; `email` obrigatório e formato válido; `password` obrigatório, mínimo 6 caracteres. Erros de validação retornam `400` (ver [Formato de Erros](#formato-de-erros)). E-mail duplicado retorna `409 Conflict`.
- **Resposta (201 Created):**
  ```json
  {
    "id": "uuid-do-usuario",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "message": "User registered successfully"
  }
  ```

### 1.2. Efetuar Login
- **Rota:** `POST /auth/login`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senha_segura_123"
  }
  ```
- **Resposta (200 OK):**
  ```json
  {
    "token": "token-jwt-gerado",
    "user": {
      "id": "uuid-do-usuario",
      "name": "Nome do Usuário",
      "email": "usuario@exemplo.com"
    }
  }
  ```
- **Credenciais inválidas:** `401 Unauthorized` com `{ "message": "E-mail ou senha inválidos" }`.

### 1.3. Validar Sessão Atual
- **Rota:** `GET /auth/me`
- **Cabeçalho:** `Authorization: Bearer <JWT_TOKEN>`
- **Resposta (200 OK):**
  ```json
  {
    "id": "uuid-do-usuario",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com"
  }
  ```

---

## 2. Perfil do Usuário (`/api/users`)

Requer autenticação JWT.

### 2.1. Obter Perfil Atual
- **Rota:** `GET /api/users/me`
- **Cabeçalho:** `Authorization: Bearer <JWT_TOKEN>`
- **Resposta (200 OK):**
  ```json
  {
    "id": "uuid-do-usuario",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com"
  }
  ```

### 2.2. Atualizar Dados do Perfil
- **Rota:** `PUT /api/users/me`
- **Cabeçalho:** `Authorization: Bearer <JWT_TOKEN>`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Nome Atualizado",
    "email": "novoemail@exemplo.com"
  }
  ```
- **Resposta (200 OK):**
  ```json
  {
    "id": "uuid-do-usuario",
    "name": "Nome Atualizado",
    "email": "novoemail@exemplo.com"
  }
  ```

### 2.3. Alterar Senha
- **Rota:** `PUT /api/users/me/password`
- **Cabeçalho:** `Authorization: Bearer <JWT_TOKEN>`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "currentPassword": "senha_atual_123",
    "newPassword": "nova_senha_segura_456"
  }
  ```
- **Resposta (24 No Content)**

### 2.4. Excluir Conta (Exclusão em Cascata)
- **Rota:** `DELETE /api/users/me`
- **Cabeçalho:** `Authorization: Bearer <JWT_TOKEN>`
- **Resposta (204 No Content)**
- *Obs: Remove também todas as transações e categorias associadas ao usuário.*

---

## 3. Categorias (`/api/categories`)

Requer autenticação JWT. As categorias são automaticamente isoladas pelo usuário logado.

### 3.1. Criar Categoria
- **Rota:** `POST /api/categories`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Alimentação",
    "type": "EXPENSE" // Valores válidos: INCOME, EXPENSE, INVESTMENT
  }
  ```
- **Validação:** `name` obrigatório (não vazio); `type` obrigatório e deve ser um dos três valores do enum. Nome vazio/ausente ou tipo inválido retornam `400` (ver [Formato de Erros](#formato-de-erros)).
- **Resposta (201 Created):**
  ```json
  {
    "id": "uuid-da-categoria",
    "name": "Alimentação",
    "type": "EXPENSE"
  }
  ```

### 3.2. Listar Categorias do Usuário
- **Rota:** `GET /api/categories`
- **Resposta (200 OK):**
  ```json
  [
    {
      "id": "uuid-da-categoria",
      "name": "Alimentação",
      "type": "EXPENSE"
    }
  ]
  ```

### 3.3. Buscar Categoria por ID
- **Rota:** `GET /api/categories/{id}`
- **Resposta (200 OK):**
  ```json
  {
    "id": "uuid-da-categoria",
    "name": "Alimentação",
    "type": "EXPENSE"
  }
  ```

### 3.4. Atualizar Categoria
- **Rota:** `PUT /api/categories/{id}`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Alimentação e Mercado",
    "type": "EXPENSE"
  }
  ```
- **Resposta (200 OK):**
  ```json
  {
    "id": "uuid-da-categoria",
    "name": "Alimentação e Mercado",
    "type": "EXPENSE"
  }
  ```

### 3.5. Excluir Categoria
- **Rota:** `DELETE /api/categories/{id}`
- **Resposta (204 No Content)**
- **Conflito:** se existirem transações vinculadas a esta categoria, retorna `409 Conflict` com `{ "message": "Este registro está em uso por outro recurso e não pode ser excluído" }`. Exclua ou reatribua as transações antes.

---

## 4. Transações Financeiras (`/api/transactions`)

Requer autenticação JWT.

**Resolução de categoria padrão ("Other"):** `categoryId` é opcional tanto em criar quanto em atualizar. Quando omitido, o backend usa/cria uma categoria `"Other"` — mas existe **uma "Other" por tipo** (`INCOME`, `EXPENSE`, `INVESTMENT`), não uma única compartilhada. Nesse caso, envie também o campo `type` para indicar qual "Other" usar; se `type` também for omitido, o padrão é `EXPENSE`. Se `categoryId` for enviado, `type` é ignorado (o tipo já vem da categoria escolhida).

### 4.1. Criar Transação
- **Rota:** `POST /api/transactions`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "description": "Compra de Mercado",
    "amount": 250.50,
    "transactionDate": "2026-06-15",
    "categoryId": "uuid-da-categoria", // Opcional
    "type": "EXPENSE" // Opcional; só usado quando categoryId é omitido
  }
  ```
- **Validação:** `description` obrigatório; `amount` obrigatório e maior que zero; `transactionDate` obrigatório. `categoryId`, quando enviado, precisa existir e pertencer ao usuário autenticado (senão `404`).
- **Resposta (201 Created):**
  ```json
  {
    "id": "uuid-da-transacao",
    "description": "Compra de Mercado",
    "amount": 250.50,
    "transactionDate": "2026-06-15",
    "categoryId": "uuid-da-categoria",
    "categoryName": "Alimentação"
  }
  ```

### 4.2. Listar Transações do Usuário
- **Rota:** `GET /api/transactions`
- **Resposta (200 OK):**
  ```json
  [
    {
      "id": "uuid-da-transacao",
      "description": "Compra de Mercado",
      "amount": 250.50,
      "transactionDate": "2026-06-15",
      "categoryId": "uuid-da-categoria",
      "categoryName": "Alimentação"
    }
  ]
  ```

### 4.3. Buscar Transação por ID
- **Rota:** `GET /api/transactions/{id}`
- **Resposta (200 OK):**
  ```json
  {
    "id": "uuid-da-transacao",
    "description": "Compra de Mercado",
    "amount": 250.50,
    "transactionDate": "2026-06-15",
    "categoryId": "uuid-da-categoria",
    "categoryName": "Alimentação"
  }
  ```

### 4.4. Atualizar Transação
- **Rota:** `PUT /api/transactions/{id}`
- **Semântica de atualização parcial:** `description`, `amount` e `transactionDate` só são alterados se enviados (omitir mantém o valor atual). **`categoryId`/`type` são a exceção:** são sempre resolvidos a cada chamada — omitir `categoryId` reatribui a transação para a "Other" do `type` informado (ou `EXPENSE` por padrão), mesmo que a transação já tivesse uma categoria diferente. Envie `categoryId` explicitamente para preservar a categoria atual.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "description": "Compra de Mercado Semanal",
    "amount": 280.00,
    "transactionDate": "2026-06-15",
    "categoryId": "uuid-da-categoria", // Opcional — omitir usa/cria a "Other" do `type`
    "type": "EXPENSE" // Opcional; só usado quando categoryId é omitido
  }
  ```
- **Resposta (200 OK):**
  ```json
  {
    "id": "uuid-da-transacao",
    "description": "Compra de Mercado Semanal",
    "amount": 280.00,
    "transactionDate": "2026-06-15",
    "categoryId": "uuid-da-categoria",
    "categoryName": "Alimentação"
  }
  ```

### 4.5. Excluir Transação
- **Rota:** `DELETE /api/transactions/{id}`
- **Resposta (204 No Content)**

---

## 5. Dashboard Financeiro (`/api/dashboard`)

Requer autenticação JWT. Retorna o consolidador de dados para montagem do Dashboard completo.

### 5.1. Obter Dados Consolidados do Dashboard
- **Rota:** `GET /api/dashboard`
- **Resposta (200 OK):**
  ```json
  {
    "summary": {
      "balance": 3000.00,
      "income": 5000.00,
      "expense": 1500.00,
      "investment": 500.00,
      "saving": 3000.00
    },
    "comparisons": {
      "income": {
        "current": 5000.00,
        "previous": 4500.00,
        "difference": 500.00,
        "percentage": 11.11
      },
      "expense": {
        "current": 1500.00,
        "previous": 1200.00,
        "difference": 300.00,
        "percentage": 25.00
      },
      "investment": {
        "current": 500.00,
        "previous": 600.00,
        "difference": -100.00,
        "percentage": -16.67
      },
      "saving": {
        "current": 3000.00,
        "previous": 2700.00,
        "difference": 300.00,
        "percentage": 11.11
      }
    },
    "insights": [
      "Você gastou 25.0% a mais que no mês passado.",
      "Você investiu R$ 100.00 a menos que no mês anterior.",
      "Alimentação representa 100.0% dos seus gastos totais.",
      "Seu maior gasto único foi \"Compra de Mercado\" no valor de R$ 250.50.",
      "Você realizou 2 transações neste mês.",
      "Você economizou R$ 3000.00 neste mês."
    ],
    "expensesByCategory": [
      {
        "category": "Alimentação",
        "amount": 1500.00,
        "percentage": 100.00
      }
    ],
    "monthlyEvolution": [
      {
        "month": "2026-05",
        "income": 4500.00,
        "expense": 1200.00,
        "investment": 600.00,
        "saving": 2700.00
      },
      {
        "month": "2026-06",
        "income": 5000.00,
        "expense": 1500.00,
        "investment": 500.00,
        "saving": 3000.00
      }
    ],
    "projections": {
      "projectedExpense": 3000.00,
      "projectedInvestment": 1000.00
    }
  }
  ```
- **`summary`** é acumulado desde o início (todas as transações). **`comparisons`** é o mês atual vs. o mês anterior. **`expensesByCategory`** só considera categorias do tipo `EXPENSE`, acumulado histórico. **`insights`** são frases já prontas em português, geradas pelo backend — o client só precisa listá-las.

---

## 6. Metas (`/api/goals`)

Requer autenticação JWT. Uma meta representa um objetivo financeiro (ex.: "PS5") com um valor alvo; o usuário vai registrando aportes até atingi-lo.

**Aportes geram transações reais:** cada aporte cria automaticamente uma transação do tipo `INVESTMENT` (categoria `"Metas"`, criada/reaproveitada por usuário), afetando saldo e dashboard como qualquer outra transação. Excluir um aporte remove também a transação associada. Excluir a meta remove em cascata todos os seus aportes e as transações geradas por eles.

`currentAmount` e `completed` são calculados a partir da soma dos aportes — não são campos editáveis diretamente.

### 6.1. Criar Meta
- **Rota:** `POST /api/goals`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "PS5",
    "targetAmount": 4000.00
  }
  ```
- **Validação:** `name` obrigatório; `targetAmount` obrigatório e maior que zero.
- **Resposta (201 Created):**
  ```json
  {
    "id": "uuid-da-meta",
    "name": "PS5",
    "targetAmount": 4000.00,
    "currentAmount": 0.00,
    "completed": false,
    "createdAt": "2026-07-05T10:00:00"
  }
  ```

### 6.2. Listar Metas do Usuário
- **Rota:** `GET /api/goals`
- **Resposta (200 OK):** array de objetos no mesmo formato do item 6.1.

### 6.3. Buscar Meta por ID
- **Rota:** `GET /api/goals/{id}`
- **Resposta (200 OK):** mesmo formato do item 6.1.

### 6.4. Atualizar Meta
- **Rota:** `PUT /api/goals/{id}`
- **Atualização parcial:** `name` e `targetAmount` só são alterados se enviados.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "PS5 Pro",
    "targetAmount": 4500.00
  }
  ```
- **Resposta (200 OK):** mesmo formato do item 6.1.

### 6.5. Excluir Meta
- **Rota:** `DELETE /api/goals/{id}`
- **Resposta (204 No Content)**
- *Obs: remove em cascata todos os aportes e as transações geradas por eles.*

### 6.6. Listar Aportes de uma Meta
- **Rota:** `GET /api/goals/{id}/contributions`
- **Resposta (200 OK):**
  ```json
  [
    {
      "id": "uuid-do-aporte",
      "amount": 500.00,
      "contributionDate": "2026-07-05",
      "transactionId": "uuid-da-transacao",
      "createdAt": "2026-07-05T10:05:00"
    }
  ]
  ```

### 6.7. Adicionar Aporte
- **Rota:** `POST /api/goals/{id}/contributions`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "amount": 500.00,
    "contributionDate": "2026-07-05"
  }
  ```
- **Validação:** `amount` obrigatório e maior que zero; `contributionDate` obrigatório.
- **Resposta (201 Created):** a meta atualizada, no mesmo formato do item 6.1 (com `currentAmount` já somado).

### 6.8. Excluir Aporte
- **Rota:** `DELETE /api/goals/{id}/contributions/{contributionId}`
- **Resposta (204 No Content)**
- *Obs: remove também a transação gerada por esse aporte.*

---

## Formato de Erros

Todo erro (exceto 401/403 padrão do Spring Security) segue o mesmo formato, produzido pelo `GlobalExceptionHandler`:

```json
{
  "timestamp": "2026-07-03T17:13:28.30",
  "status": 400,
  "error": "Validation Error",
  "message": "Dados inválidos",
  "path": "/api/categories",
  "fields": { "name": "Name is required" }
}
```

`fields` só aparece em erros de validação (`400`) e mapeia nome do campo → mensagem. Nos demais casos vem omitido.

| Status | Quando acontece |
| :--- | :--- |
| `400 Bad Request` | Falha de validação Bean Validation (`@NotBlank`, `@NotNull`, `@Positive`, `@Email`, etc.) — inclui `fields`. Também usado para JSON malformado ou valor de enum inválido (ex.: `"type": "NAOEXISTE"`) — sem `fields`. |
| `401 Unauthorized` | Credenciais de login inválidas, ou token ausente/expirado/inválido em rota protegida. |
| `403 Forbidden` | Usuário autenticado tentando acessar recurso sem permissão. |
| `404 Not Found` | Categoria, transação, meta ou aporte não encontrado (ou não pertence ao usuário autenticado — o isolamento por usuário faz um recurso de outro usuário parecer inexistente). |
| `409 Conflict` | E-mail já cadastrado no registro; ou tentativa de excluir uma categoria com transações vinculadas (violação de integridade referencial). |
| `500 Internal Server Error` | Erro inesperado não tratado — não deveria acontecer em uso normal; se acontecer, é bug. |
