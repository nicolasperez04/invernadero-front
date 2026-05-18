const taiga = require('./taiga.js');

async function main() {
  try {
    console.log('🔐 Autenticando en Taiga...');
    await taiga.login();
    console.log('✅ Autenticado\n');

    console.log('📋 Obteniendo estados de User Stories...');
    const statuses = await taiga.getUserStoryStatuses();
    console.log('Estados disponibles:');
    statuses.forEach((s) => {
      console.log(`   ID: ${s.id} - ${s.name}`);
    });

    const readyStatus = statuses.find(
      (s) => s.name.toLowerCase().includes('ready') || s.name.toLowerCase().includes(' backlog'),
    );
    const inProgressStatus = statuses.find(
      (s) =>
        s.name.toLowerCase().includes('progress') || s.name.toLowerCase().includes('desarrollo'),
    );

    const targetStatus = inProgressStatus || readyStatus || statuses[0];
    console.log(`\n📌 Estado objetivo: ${targetStatus.name} (ID: ${targetStatus.id})`);

    const userStories = await taiga.getUserStories();
    console.log(`\n📝 Actualizando ${userStories.length} User Stories...\n`);

    for (const us of userStories) {
      console.log(`   Actualizando: ${us.subject.substring(0, 40)}... (ID: ${us.id})`);
      console.log(`      Estado actual: ${us.status_extra_info?.name || 'Unknown'}`);
      await taiga.updateUserStoryStatus(us.id, targetStatus.id);
      console.log(`      ✅ Cambiado a: ${targetStatus.name}\n`);
    }

    console.log('✅ Todas las User Stories actualizadas a estado:', targetStatus.name);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
