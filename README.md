# pazuno-docker-postgres

Projeto de Docker + PostgreSQL para o trabalho da UniRitter. O cenário é o **cadastro interno da Pazuno**, uma loja de acessórios pet: a equipe da loja, os clientes (pessoa física ou jurídica) e o catálogo de produtos ficam no banco `pazuno_catalogo`.

## Cenário

A Pazuno precisa de um cadastro interno simples para operação diária:

| Tabela | Finalidade | Exemplo fictício |
|---|---|---|
| `usuarios` | Equipe da loja (login interno) | Atendente *Marina Souza* (`marina.souza`) |
| `clientes` | Clientes PF ou PJ | Pet shop *AuAu Pet Center* (`tipo = juridico`) |
| `produtos` | Itens do catálogo | Coleira ajustável nylon azul — R$ 49,90 |

As três tabelas são **independentes** (sem FKs entre si). Fora das chaves primárias, os campos são opcionais (nullable).

## Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (recomendado) e npm
- `psql` / cliente PostgreSQL (opcional, para inspeção)

## Configuração

```bash
cp .env.example .env
# Ajuste POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB e POSTGRES_PORT se quiser
npm ci
```

Valores de demonstração no `.env.example`:

- `POSTGRES_USER=pazuno`
- `POSTGRES_PASSWORD=pazuno123`
- `POSTGRES_DB=pazuno_catalogo`
- `POSTGRES_PORT=5432`

## Subir o banco

```bash
docker compose config --quiet
docker compose up -d
docker compose exec postgres pg_isready -U pazuno -d pazuno_catalogo
```

## Criar e verificar tabelas

Os scripts rodam no **host** e se conectam pela porta publicada:

```bash
npm run criar-tabelas
npm run criar-tabelas   # idempotente (IF NOT EXISTS)
npm run verificar-tabelas
```

## Inspecionar no psql

```bash
docker compose exec postgres psql -U pazuno -d pazuno_catalogo
```

Exemplos úteis:

```sql
\d usuarios
\d clientes
\d produtos

SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid IN ('public.clientes'::regclass, 'public.produtos'::regclass)
  AND contype = 'c';
```

## Parar o banco

```bash
docker compose down
```

Para remover também o volume de dados:

```bash
docker compose down -v
```

## Estrutura do projeto

| Arquivo | Função |
|---|---|
| `docker-compose.yml` | Serviço `postgres` (`postgres:17`) com volume nomeado |
| `.env` / `.env.example` | Credenciais e porta do PostgreSQL |
| `conexao.js` | Função compartilhada `criarConexao()` |
| `criar-tabelas.js` | DDL das tabelas `usuarios`, `clientes` e `produtos` |
| `verificar-tabelas.js` | Confirma presença via `information_schema.tables` |
| `package.json` | Scripts `npm run criar-tabelas` e `npm run verificar-tabelas` |

## Entrega (UniRitter)

Publique este repositório no Git e envie o link. A entrega deve incluir, no mínimo, o `docker-compose.yml` e o script `criar-tabelas.js`.
