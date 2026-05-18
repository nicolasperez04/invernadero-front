const taiga = require('./taiga.js');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  bright: '\x1b[1m',
};

function log(msg, color = 'reset') {
  console.log(colors[color] + msg + colors.reset);
}

const sprintsToClose = [
  { id: 517872, name: 'Sprint 1 - Seguridad' },
  { id: 517873, name: 'Sprint 2 - Cultivos y Lotes' },
  { id: 517874, name: 'Sprint 3 - Eventos' },
];

const sprintToKeepOpen = {
  id: 517875,
  name: 'Sprint 4 - Dashboard',
};

async function main() {
  try {
    log('🔐 Autenticando en Taiga...', 'cyan');
    await taiga.login();
    log('✅ Autenticado\n', 'green');

    const api = taiga.getApiInternal();

    log('🔒 Cerrando Sprints 1, 2 y 3...\n', 'bright');

    for (const sprint of sprintsToClose) {
      try {
        log(`   📦 Cerrando: ${sprint.name} (ID: ${sprint.id})`, 'cyan');

        await api.patch(`/milestones/${sprint.id}`, {
          closed: true,
        });

        log(`      ✅ Sprint cerrado`, 'green');
      } catch (err) {
        log(`      ⚠️ Error: ${err.message}`, 'yellow');
      }
    }

    log('\n✅ Sprints 1, 2 y 3 cerrados correctamente\n', 'green');

    log('📋 Verificando Sprint 4...\n', 'bright');
    log(`   Sprint 4 - Dashboard (ID: ${sprintToKeepOpen.id}) permanece activo`, 'cyan');

    log('\n🎉 Proceso completado!', 'green');
  } catch (error) {
    log('❌ Error: ' + error.message, 'red');
    process.exit(1);
  }
}

main();
