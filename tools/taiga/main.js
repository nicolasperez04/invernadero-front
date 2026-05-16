const taiga = require('./taiga.js');
const { getTemplate } = require('./templates.js');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function log(msg, color = 'white') {
  console.log(colors[color] + msg + colors.reset);
}

function logError(msg) {
  console.error(colors.red + '❌ Error: ' + msg + colors.reset);
}

function logSuccess(msg) {
  console.log(colors.green + msg + colors.reset);
}

function logInfo(msg, color = 'cyan') {
  console.log(colors[color] + msg + colors.reset);
}

function logTask(msg) {
  console.log('   ' + colors.green + '✓' + colors.reset + ' ' + msg);
}

function logWarning(msg) {
  console.log('   ' + colors.yellow + '⚠️' + colors.reset + ' ' + msg);
}

async function processModule(moduleName, verbose = false) {
  if (verbose) {
    logInfo(`\n📦 Procesando módulo: ${moduleName}`, 'magenta');
  }

  const template = getTemplate(moduleName);

  if (!template) {
    logError(`Módulo "${moduleName}" no reconocido`);
    return null;
  }

  if (verbose) {
    logInfo(`   Prioridad: ${template.priority}`, 'dim');
    logInfo(`   Título: ${template.userStory}`, 'dim');
  }

  logInfo(`📝 Creando User Story: ${template.userStory}`, 'yellow');
  const userStoryId = await taiga.createUserStory(template.userStory, template.description);

  if (verbose) {
    logInfo(`   ID: ${userStoryId}`, 'dim');
  }

  if (template.description) {
    const desc = template.description.length > 100 
      ? template.description.substring(0, 100) + '...' 
      : template.description;
    logInfo(`   📄 ${desc}`, 'dim');
  }

  logInfo('📋 Creando tasks:', 'yellow');

  let tasksCreated = 0;
  for (const task of template.tasks) {
    const taskId = await taiga.createTask(userStoryId, task);
    logTask(`${task} (ID: ${taskId})`);
    tasksCreated++;
  }

  if (verbose) {
    logInfo(`\n   Resumen: ${tasksCreated} tareas creadas`, 'dim');
  }

  return {
    module: moduleName,
    userStory: template.userStory,
    userStoryId,
    tasks: tasksCreated,
    priority: template.priority,
  };
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
${colors.bright}Invernadero - Automatización Taiga${colors.reset}

${colors.cyan}Uso:${colors.reset}
  npm run taiga "<módulo>" [--verbose]
  npm run taiga "<módulo1>,<módulo2>" [--verbose]

${colors.cyan}Módulos disponibles:${colors.reset}
  auth, usuarios, cultivos, lotes, eventos, tipos de evento, dashboard

${colors.cyan}Ejemplos:${colors.reset}
  npm run taiga "auth"                    # Crear módulo auth
  npm run taiga "auth,usuarios"           # Crear múltiples módulos
  npm run taiga "dashboard --verbose"     # Con información detallada

${colors.cyan}Opciones:${colors.reset}
  --verbose, -v    Mostrar información detallada
  --help, -h       Mostrar esta ayuda
`);
    process.exit(1);
  }

  if (args.includes('--help') || args.includes('-h')) {
    log('Ayuda de Taiga CLI:', 'cyan');
    console.log('  npm run taiga "modulo" [--verbose]');
    console.log('  Módulos: auth, usuarios, cultivos, lotes, eventos, tipos de evento, dashboard');
    process.exit(0);
  }

  const verbose = args.includes('--verbose') || args.includes('-v');
  
  let modules = args
    .filter(arg => !arg.startsWith('--') && !arg.startsWith('-'))
    .join(',')
    .split(',')
    .map(m => m.trim())
    .filter(m => m.length > 0);

  if (modules.length === 0) {
    logError('No se especificó ningún módulo');
    process.exit(1);
  }

  try {
    if (verbose) {
      logInfo('🚀 Iniciando automatización Taiga\n', 'bright');
    } else {
      logInfo('🔐 Autenticando en Taiga...', 'cyan');
    }
    
    await taiga.login();
    logSuccess('✅ Autenticado\n');

    const results = [];
    
    for (const moduleName of modules) {
      const result = await processModule(moduleName, verbose);
      if (result) {
        results.push(result);
      } else {
        console.log(`   Módulos disponibles: auth, usuarios, cultivos, lotes, eventos, tipos de evento, dashboard`);
      }
    }

    if (results.length > 0) {
      console.log('\n' + colors.bright + '🎉 Backlog creado exitosamente!' + colors.reset);
      console.log(`   Proyecto ID: ${taiga.getProjectId()}`);
      
      if (results.length === 1) {
        console.log(`   User Story: ${results[0].userStoryId}`);
        console.log(`   Tasks: ${results[0].tasks}`);
      } else {
        console.log(`\n   📊 Resumen:`);
        for (const r of results) {
          console.log(`      ${r.module}: ${r.tasks} tasks (US #${r.userStoryId})`);
        }
        console.log(`\n   Total: ${results.length} módulos, ${results.reduce((a, b) => a + b.tasks, 0)} tareas`);
      }
    }
  } catch (error) {
    logError(error.message);
    process.exit(1);
  }
}

main();