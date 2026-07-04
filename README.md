# Fluxo

![Fluxo](app.png)

Fluxo é um sistema de administração financeira pessoal: controle de receitas, despesas e investimentos, com categorias, projeções de caixa e um dashboard com gráficos.

Monorepo com duas partes:

- **`client/`** — React 19 + TypeScript + Vite + TailwindCSS v4.
- **`server/`** — Java 21 + Spring Boot 4 + Spring Security (JWT) + PostgreSQL 17.

## Rodando localmente

### 1. Banco de dados

```bash
docker compose up -d
```

Credenciais em [.env](.env) (ver [.env.example](.env.example) para o formato esperado).

### 2. Backend

```bash
cd server
./mvnw spring-boot:run
```

Sobe em `http://localhost:8080`.

### 3. Frontend

```bash
cd client
pnpm install
pnpm dev
```

Sobe em `http://localhost:5173`. O backend já libera CORS para essa origem.

## Documentação

- [`docs/api.md`](docs/api.md) — endpoints REST, formatos de requisição/resposta e erros.
- [`docs/arquitetura.md`](docs/arquitetura.md) — arquitetura de backend e frontend.
- [`docs/banco.md`](docs/banco.md) — modelo de dados e ERD.
- [`AGENTS.md`](AGENTS.md) — convenções de código e design system, para quem (humano ou agente) for mexer no projeto.
