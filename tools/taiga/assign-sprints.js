const taiga = require('./taiga.js');

async function main() {
  try {
    console.log('🔐 Autenticando en Taiga...');
    await taiga.login();
    console.log('✅ Autenticado\n');

    const sprints = [
      { id: 517872, name: 'Sprint 1 - Seguridad', stories: [9247039, 9247053] },
      { id: 517873, name: 'Sprint 2 - Cultivos y Lotes', stories: [9247055, 9247017] },
      { id: 517874, name: 'Sprint 3 - Eventos', stories: [9247056] },
      { id: 517875, name: 'Sprint 4 - Dashboard', stories: [9247054, 9247057] },
    ];

    console.log('📋 Asignando User Stories a sprints...\n');

    for (const sprint of sprints) {
      console.log(`📦 ${sprint.name} (ID: ${sprint.id})`);
      for (const usId of sprint.stories) {
        try {
          await taiga.addUserStoryToSprint(sprint.id, usId);
          console.log(`   ✅ US #${usId} asignada`);
        } catch (err) {
          console.log(`   ⚠️ Error: ${err.message}`);
        }
      }
      console.log('');
    }

    console.log('✅ Asignación completada!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();