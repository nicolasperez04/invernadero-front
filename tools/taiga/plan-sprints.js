const taiga = require('./taiga.js');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
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

    log(`   Total: ${userStories.length} user stories\n`, 'yellow');

    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];
    const addDays = (days) => formatDate(new Date(today.getTime() + days * 24 * 60 * 60 * 1000));

    const sprints = [
      {
        name: 'Sprint 1 - Seguridad',
        start: addDays(0),
        end: addDays(14),
        modules: ['AUTH', 'USR'],
        stories: userStories.filter(
          (us) => us.subject.includes('AUTH') || us.subject.includes('USR'),
        ),
      },
      {
        name: 'Sprint 2 - Cultivos y Lotes',
        start: addDays(14),
        end: addDays(28),
        modules: ['CRP', 'LOT'],
        stories: userStories.filter(
          (us) => us.subject.includes('CRP') || us.subject.includes('LOT'),
        ),
      },
      {
        name: 'Sprint 3 - Eventos',
        start: addDays(28),
        end: addDays(42),
        modules: ['EVT'],
        stories: userStories.filter(
          (us) => us.subject.includes('EVT') && !us.subject.includes('TYPE'),
        ),
      },
      {
        name: 'Sprint 4 - Dashboard y Tipos',
        start: addDays(42),
        end: addDays(56),
        modules: ['DSH', 'EVT-TYPE'],
        stories: userStories.filter(
          (us) => us.subject.includes('DSH') || us.subject.includes('EVT-TYPE'),
        ),
      },
    ];

    log('📊 Plan de Sprints sugeridos para el proyecto Invernadero\n', 'bright');
    log('='.repeat(60), 'cyan');

    for (const sprint of sprints) {
      log(`\n${colors.bright}🏃 ${sprint.name}${colors.reset}`, 'magenta');
      log(`   📅 ${sprint.start} al ${sprint.end}`, 'cyan');
      log(`   🎯 Módulos: ${sprint.modules.join(', ')}`, 'yellow');
      log(`   📝 User Stories (${sprint.stories.length}):`, 'green');

      if (sprint.stories.length === 0) {
        const modulesFilter = sprint.modules.join('|');
        const allStories = userStories.filter((us) =>
          modulesFilter.some((m) => us.subject.includes(m)),
        );
        for (const us of allStories) {
          log(`      • ${us.subject.substring(0, 50)}... (ID: ${us.id})`, 'reset');
        }
        if (allStories.length === 0) {
          log(`      (No se encontraron US en Taiga para este sprint)`, 'yellow');
        }
      } else {
        for (const us of sprint.stories) {
          log(`      • ${us.subject.substring(0, 45)}... (ID: ${us.id})`, 'reset');
        }
      }
    }

    log('\n' + '='.repeat(60), 'cyan');
    log('\n📌 Nota:', 'yellow');
    log('   Los sprints deben crearse manualmente en la interfaz de Taiga', 'reset');
    log('   Project Settings → Sprints → Add Sprint', 'dim');
    log(`   Proyecto ID: ${taiga.getProjectId()}`, 'dim');
    log('\n✅ Planificación completada!', 'green');
  } catch (error) {
    log('❌ Error: ' + error.message, 'red');
    process.exit(1);
  }
}

main();
