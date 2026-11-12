import { criarConexao } from './conexao.js';

const sqlCriarTabelas = `
CREATE TABLE IF NOT EXISTS public.usuarios (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(255),
  email VARCHAR(255),
  senha VARCHAR(255),
  username VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS public.clientes (
  id VARCHAR(20) PRIMARY KEY,
  nome_fantasia VARCHAR(255),
  razao_social VARCHAR(255),
  cpf_cnpj VARCHAR(18),
  tipo VARCHAR(8),
  email VARCHAR(255),
  CONSTRAINT clientes_tipo_check CHECK (tipo IN ('juridico', 'fisico'))
);

CREATE TABLE IF NOT EXISTS public.produtos (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  descricao VARCHAR(255),
  departamento VARCHAR(255),
  codigo_barras VARCHAR(13),
  preco NUMERIC(10, 2),
  CONSTRAINT produtos_codigo_barras_check CHECK (char_length(codigo_barras) = 13)
);
`;

async function main() {
  const client = criarConexao();

  try {
    await client.connect();
    await client.query(sqlCriarTabelas);
    console.log('Tabelas usuarios, clientes e produtos criadas (ou já existentes) com sucesso.');
  } catch (erro) {
    console.error('Erro ao criar tabelas:', erro.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
