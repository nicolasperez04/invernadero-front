const taiga = require('./taiga.js');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(colors[color] + msg + colors.reset);
}

async function main() {
  try {
    log('🔐 Autenticando en Taiga...', 'cyan');
    await taiga.login();
    log('✅ Autenticado\n', 'green');

    log('📋 Obteniendo User Stories del proyecto...', 'cyan');
    const userStories = await taiga.getUserStories();
    
    log(`   Encontradas: ${userStories.length} user stories\n`, 'yellow');

    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    const sprints = [
      {
        name: 'Sprint 1 - Seguridad',
        start: new Date(today),
        end: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
        stories: userStories.filter(us => 
          us.subject.includes('AUTH') || us.subject.includes('USR')
        ).map(us => us.id),
      },
      {
        name: 'Sprint 2 - Cultivos y Lotes',
        start: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000),
        stories: userStories.filter(us => 
          us.subject.includes('CRP') || us.subject.includes('LOT')
        ).map(us => us.id),
      },
      {
        name: 'Sprint 3 - Eventos',
        start: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 42 * 24 * 60 * 60 * 1000),
        stories: userStories.filter(us => 
          us.subject.includes('EVT') && !us.subject.includes('EVT-TYPE')
        ).map(us => us.id),
      },
      {
        name: 'Sprint 4 - Dashboard',
        start: new Date(today.getTime() + 42 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 56 * 24 * 60 * 60 * 1000),
        stories: userStories.filter(us => 
          us.subject.includes('DSH') || us.subject.includes('EVT-TYPE')
        ).map(us => us.id),
      },
    ];

    log('🚀 Creando sprints y asignando User Stories...\n', 'bright');

    const createdSprints = [];

    for (const sprint of sprints) {
      if (sprint.stories.length === 0) {
        log(`   ⏭️  ${sprint.name}: Sin User Stories relacionadas`, 'yellow');
        continue;
      }

      log(`   📦 Creando: ${sprint.name}`, 'cyan');
      log(`      Fechas: ${formatDate(sprint.start)} - ${formatDate(sprint.end)}`, 'dim');
      log(`      User Stories: ${sprint.stories.join(', ')}`, 'dim');
      
      const sprintId = await taiga.createSprint(
        sprint.name,
        formatDate(sprint.start),
        formatDate(sprint.end)
      );
      log(`      ✅ Sprint creado (ID: ${sprintId})`, 'green');

      createdSprints.push({ name: sprint.name, id: sprintId, stories: sprint.stories });

      log(`      📋 Asignando ${sprint.stories.length} User Stories...`, 'cyan');
      for (const usId of sprint.stories) {
        try {
          await taiga.addUserStoryToSprint(sprintId, usId);
          log(`         ✅ US #${usId} asignada al sprint`, 'green');
        } catch (err) {
          log(`         ⚠️ Error al asignar US #${usId}: ${err.message}`, 'yellow');
        }
      }
    }

    log('\n🎉 Sprints configurados exitosamente!', 'bright');
    log(`   Proyecto: ${taiga.getProjectId()}`, 'cyan');
    log(`   Total de sprints creados: ${createdSprints.length}`, 'cyan');
    
    console.log('\n📊 Resumen:');
    for (const s of createdSprints) {
      console.log(`   • ${s.name} (ID: ${s.id}) - ${s.stories.length} US`);
    }

  } catch (error) {
    log('❌ Error: ' + error.message, 'red');
    process.exit(1);
  }
}

main();