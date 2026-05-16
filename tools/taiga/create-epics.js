const taiga = require('./taiga.js');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

function log(msg, color = 'reset') {
  console.log(colors[color] + msg + colors.reset);
}

async function createEpic(name, description, color = '#E57C40') {
  const api = require('./taiga.js').getApiInternal();
  const response = await api.post('/epics', {
    project: parseInt(process.env.TAIGA_PROJECT_ID, 10),
    subject: name,
    description: description,
    color: color,
  });
  return response.data.id;
}

const epics = [
  {
    name: 'Backend API',
    description: 'Implementación del backend con Spring Boot. Incluye Authentication, Users, Crops, Lots, Events y Event Types.',
    color: '#4FC3F7',
    stories: [9247053, 9247039, 9247017, 9247055, 9247056, 9247054],
  },
  {
    name: 'Frontend',
    description: 'Implementación del frontend con Angular. Dashboard, componentes UI, integración con API REST.',
    color: '#81C784',
    stories: [9247057],
  },
];

async function main() {
  try {
    log('🔐 Autenticando en Taiga...', 'cyan');
    await taiga.login();
    log('✅ Autenticado\n', 'green');

    log('📋 Creando Epics...\n', 'bright');

    const api = taiga.getApiInternal();

    for (const epic of epics) {
      log(`   📦 Creando Epic: ${epic.name}`, 'cyan');
      
      const response = await api.post('/epics', {
        project: parseInt(process.env.TAIGA_PROJECT_ID, 10),
        subject: epic.name,
        description: epic.description,
        color: epic.color,
      });
      
      const epicId = response.data.id;
      log(`      ✅ Epic creado (ID: ${epicId})`, 'green');
      log(`      📝 Asignando ${epic.stories.length} User Stories...`, 'cyan');

      for (const usId of epic.stories) {
        try {
          await api.post(`/epics/${epicId}/related_userstories`, {
            user_story: usId,
          });
          log(`         ✅ US #${usId} vinculada al epic`, 'green');
        } catch (err) {
          log(`         ⚠️ Error al vincular US #${usId}: ${err.message}`, 'yellow');
        }
      }
      console.log('');
    }

    log('🎉 Epics creados exitosamente!', 'bright');

  } catch (error) {
    log('❌ Error: ' + error.message, 'red');
    process.exit(1);
  }
}

main();