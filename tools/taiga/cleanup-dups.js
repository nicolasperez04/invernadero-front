const taiga = require('./taiga.js');

const duplicates = [
  { id: 9247016, name: 'AUTH antigua' },
  { id: 9247025, name: 'LOT antigua' },
  { id: 9247032, name: 'EVT antigua' },
  { id: 9247030, name: 'DSH antigua' },
];

async function main() {
  try {
    console.log('🔐 Autenticando en Taiga...');
    await taiga.login();
    console.log('✅ Autenticado\n');

    console.log('🗑️ Eliminando User Stories duplicadas (versiones antiguas)...\n');

    for (const dup of duplicates) {
      try {
        console.log(`   Eliminando: ${dup.name} (ID: ${dup.id})`);
        await taiga.deleteUserStory(dup.id);
        console.log(`   ✅ Eliminado: ${dup.name}\n`);
      } catch (err) {
        console.log(`   ⚠️ Error al eliminar ${dup.name}: ${err.message}\n`);
      }
    }

    console.log('✅ Limpieza completada!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();