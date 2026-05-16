const taiga = require('./taiga.js');

async function main() {
  try {
    console.log('🔐 Autenticando en Taiga...');
    await taiga.login();
    console.log('✅ Autenticado\n');

    console.log('🗑️ Eliminando User Stories duplicadas de AUTH...\n');

    const duplicates = [1, 2];

    for (const id of duplicates) {
      try {
        await taiga.deleteUserStory(id);
      } catch (err) {
        console.log(`   ⚠️ Error al eliminar ID ${id}: ${err.message}`);
      }
    }

    console.log('\n✅ Limpieza completada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();