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

const sprintMapping = {
  517872: { name: 'Sprint 1 - Seguridad', usIds: [9247039, 9247053], status: 'Done' },
  517873: { name: 'Sprint 2 - Cultivos y Lotes', usIds: [9247055, 9247017], status: 'Done' },
  517874: { name: 'Sprint 3 - Eventos', usIds: [9247056], status: 'Done' },
  517875: { name: 'Sprint 4 - Dashboard', usIds: [9247054, 9247057], status: 'In progress' },
};

async function main() {
  try {
    log('Autenticando en Taiga...', 'cyan');
    await taiga.login();
    log('Autenticado\n', 'green');

    const api = taiga.getApiInternal();

    const taskStatuses = await api.get(`/projects/${process.env.TAIGA_PROJECT_ID}`);
    const statuses = taskStatuses.data.task_statuses;

    const closedStatus = statuses.find((s) => s.name.toLowerCase().includes('closed'));
    const inProgressStatus = statuses.find((s) => s.name.toLowerCase().includes('progress'));

    log('Estados de tasks disponibles:', 'cyan');
    statuses.forEach((s) => console.log(`   - ${s.name} (ID: ${s.id})`));
    console.log('');

    log(
      `Estado "Done" (Closed): ${closedStatus?.name || 'No encontrado'} (ID: ${closedStatus?.id})`,
    );
    log(
      `Estado "In Progress": ${inProgressStatus?.name || 'No encontrado'} (ID: ${inProgressStatus?.id})\n`,
    );

    log('Actualizando estado de tasks...\n', 'bright');

    const userStories = await taiga.getUserStories();
    let totalUpdated = 0;
    let totalDone = 0;
    let totalInProgress = 0;

    for (const us of userStories) {
      if (!us.milestone) {
        log(`US #${us.ref} sin sprint asignado`, 'yellow');
        continue;
      }

      const sprintInfo = sprintMapping[us.milestone];
      if (!sprintInfo) continue;

      const targetStatus = sprintInfo.status === 'Done' ? closedStatus : inProgressStatus;
      const tasks = await taiga.getTasks(us.id);

      log(`${sprintInfo.name} - US #${us.ref}: ${tasks.length} tasks`, 'cyan');

      for (const task of tasks) {
        try {
          await api.patch(`/tasks/${task.id}`, {
            status: targetStatus.id,
            version: task.version,
          });
          totalUpdated++;
          if (sprintInfo.status === 'Done') {
            totalDone++;
          }
          if (sprintInfo.status === 'In progress') {
            totalInProgress++;
          }
          log(`   Task: ${task.subject.substring(0, 40)}... -> ${targetStatus.name}`, 'green');
        } catch (err) {
          log(`   Error en task: ${err.message}`, 'yellow');
        }
      }
    }

    console.log('');
    log('Actualizacion completada!', 'bright');
    log(`   Total tasks actualizadas: ${totalUpdated}`, 'cyan');
    log(`   -> Done: ${totalDone}`, 'green');
    log(`   -> In Progress: ${totalInProgress}`, 'yellow');
  } catch (error) {
    log('Error: ' + error.message, 'red');
    process.exit(1);
  }
}

main();
