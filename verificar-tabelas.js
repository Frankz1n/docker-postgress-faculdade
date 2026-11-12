import { criarConexao } from './conexao.js';

const TABELAS_ESPERADAS = ['usuarios', 'clientes', 'produtos'];

async function main() {
  const client = criarConexao();
  let houveFalha = false;

  try {
    await client.connect();

    const { rows } = await client.query(
      `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND table_name = ANY($1::text[])
      ORDER BY table_name;
      `,
      [TABELAS_ESPERADAS],
    );

    const encontradas = new Set(rows.map((linha) => linha.table_name));

    console.log('Verificação das tabelas no schema public:\n');

    for (const tabela of TABELAS_ESPERADAS) {
      if (encontradas.has(tabela)) {
        console.log(`  [OK]   ${tabela} — presente`);
      } else {
        console.log(`  [FALHA] ${tabela} — ausente`);
        houveFalha = true;
      }
    }

    if (houveFalha) {
      console.error('\nUma ou mais tabelas obrigatórias estão ausentes.');
      process.exitCode = 1;
    } else {
      console.log('\nTodas as tabelas obrigatórias estão presentes.');
    }
  } catch (erro) {
    console.error('Erro ao verificar tabelas:', erro.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
