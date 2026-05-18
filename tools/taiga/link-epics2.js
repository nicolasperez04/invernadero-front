const taiga = require('./taiga.js');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

function log(msg, color = 'reset') {
  console.log(colors[color] + msg + colors.reset);
}

const epics = [
  {
    id: 355536,
    name: 'Backend API',
    stories: [9247053, 9247039, 9247017, 9247055, 9247056, 9247054],
  },
  { id: 355537, name: 'Frontend', stories: [9247057] },
];

async function main() {
  try {
    log('🔐 Autenticando en Taiga...', 'cyan');
    await taiga.login();
    log('✅ Autenticado\n', 'green');

    const api = taiga.getApiInternal();

    log('📝 Vinculando User Stories a Epics (método PATCH)...\n', 'bright');

    for (const epic of epics) {
      log(`📦 ${epic.name} (ID: ${epic.id})`, 'cyan');

      for (const usId of epic.stories) {
        try {
          const usRes = await api.get(`/userstories/${usId}`);
          const us = usRes.data;

          await api.patch(`/userstories/${usId}`, {
            epics: [epic.id],
            version: us.version,
          });
          log(`   ✅ US #${usId} vinculada`, 'green');
        } catch (err) {
          console.log(`   Debug:`, err.response?.status, err.response?.data);
          log(`   ⚠️ US #${usId}: ${err.response?.status}`, 'yellow');
        }
      }
      console.log('');
    }

    log('✅ Vinculación completada!', 'green');
  } catch (error) {
    log('❌ Error: ' + error.message, 'red');
    process.exit(1);
  }
}

main();
