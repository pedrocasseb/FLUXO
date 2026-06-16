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
- **Resposta (201 Created):**
  ```json
  {
    "id": "uuid-do-usuario",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com"
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
    "token": "token-jwt-gerado"
  }
  ```

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

---

## 4. Transações Financeiras (`/api/transactions`)

Requer autenticação JWT. Se uma transação for criada sem categoria, ela será associada à categoria padrão `"Other"`.

### 4.1. Criar Transação
- **Rota:** `POST /api/transactions`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "description": "Compra de Mercado",
    "amount": 250.50,
    "transactionDate": "2026-06-15",
    "categoryId": "uuid-da-categoria" // Opcional (se omitido, associa à categoria "Other")
  }
  ```
- **Resposta (201 Created):**
  ```json
  {
    "id": "uuid-da-transacao",
    "description": "Compra de Mercado",
    "amount": 250.50,
    "transactionDate": "2026-06-15",
    "category": {
      "id": "uuid-da-categoria",
      "name": "Alimentação",
      "type": "EXPENSE"
    }
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
      "category": {
        "id": "uuid-da-categoria",
        "name": "Alimentação",
        "type": "EXPENSE"
      }
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
    "category": {
      "id": "uuid-da-categoria",
      "name": "Alimentação",
      "type": "EXPENSE"
    }
  }
  ```

### 4.4. Atualizar Transação
- **Rota:** `PUT /api/transactions/{id}`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "description": "Compra de Mercado Semanal",
    "amount": 280.00,
    "transactionDate": "2026-06-15",
    "categoryId": "uuid-da-categoria"
  }
  ```
- **Resposta (200 OK):**
  ```json
  {
    "id": "uuid-da-transacao",
    "description": "Compra de Mercado Semanal",
    "amount": 280.00,
    "transactionDate": "2026-06-15",
    "category": {
      "id": "uuid-da-categoria",
      "name": "Alimentação",
      "type": "EXPENSE"
    }
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
