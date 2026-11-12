import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

/**
 * Cria e retorna um Client do pg configurado com as variáveis do .env.
 * Os scripts rodam no host e se conectam pela porta publicada do Compose.
 */
export function criarConexao() {
  const porta = Number(process.env.POSTGRES_PORT ?? 5432);

  return new Client({
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: porta,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });
}
