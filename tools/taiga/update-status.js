const taiga = require('./taiga.js');

async function main() {
  try {
    console.log('🔐 Autenticando en Taiga...');
    await taiga.login();
    console.log('✅ Autenticado\n');

    console.log('📋 Obteniendo User Stories...');
    const userStories = await taiga.getUserStories();
    console.log(`   Total: ${userStories.length} user stories\n`);

    console.log('🔍 Obteniendo estados disponibles...');
    const statuses = await taiga.getUserStoryStatuses();
    
    let inProgressStatus = null;
    for (const status of statuses) {
      const name = (status.name || '').toString().toLowerCase();
      if (name.includes('progress') || name.includes('inprogress') || name.includes('started') || name.includes('desarrollo')) {
        inProgressStatus = status.id;
        console.log(`   Estado "In Progress" encontrado: ${status.name} (ID: ${status.id})`);
        break;
      }
    }

    if (!inProgressStatus && statuses.length > 0) {
      inProgressStatus = statuses[0].id;
      console.log(`   Usando primer estado disponible: ${statuses[0].name} (ID: ${statuses[0].id})`);
    }

    if (!inProgressStatus) {
      console.log('❌ No se pudo determinar el estado "In Progress"');
      process.exit(1);
    }

    console.log('\n📝 Actualizando estado de cada User Story a "In Progress"...\n');

    let updated = 0;
    for (const us of userStories) {
      if (us.status !== inProgressStatus) {
        await taiga.updateUserStoryStatus(us.id, inProgressStatus);
        console.log(`   ✅ ${us.subject.substring(0, 45)}... (ID: ${us.id})`);
        updated++;
      } else {
        console.log(`   ⏭️  ${us.subject.substring(0, 45)}... (ID: ${us.id}) - Ya en progreso`);
      }
    }

    console.log(`\n✅ Proceso completado`);
    console.log(`   Total actualizadas: ${updated}`);
    console.log(`   Total user stories: ${userStories.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();