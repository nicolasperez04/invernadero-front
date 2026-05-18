const taiga = require('./taiga.js');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

function log(msg, color = 'reset') {
  console.log(colors[color] + msg + colors.reset);
}

const issues = [
  {
    title: 'Completar tests unitarios',
    description:
      'El coverage actual de tests es menor al 70%. Completar los tests unitarios pendientes para los siguientes modulos:\n\n- AUTH: Tests de autenticacion y seguridad\n- USR: Tests de gestion de usuarios\n- CRP: Tests de cultivos\n- LOT: Tests de lotes y estados dinamicos\n- EVT: Tests de eventos\n- DSH: Tests de dashboard',
    priority: 5375924, // High
    status: 12536199, // New
    tags: ['tests', 'tech-debt'],
  },
  {
    title: 'Documentar API con Swagger',
    description:
      'Generar documentacion OpenAPI/Swagger para todos los endpoints REST del backend. Incluir:\n\n- Descripcion de cada endpoint\n- Parametros de entrada y salida\n- Codigos de respuesta\n- Ejemplos de requests/responses',
    priority: 5375923, // Normal
    status: 12536199,
    tags: ['documentation', 'api'],
  },
  {
    title: 'Refactorizar codigo duplicado',
    description:
      'Identificar y limpiar codigo duplicado en los servicios de Spring Boot. Revisar:\n\n- Repositorio base para operaciones CRUD comunes\n- Utilidades de validacion\n- Manejo de errores',
    priority: 5375923,
    status: 12536199,
    tags: ['refactor', 'tech-debt'],
  },
  {
    title: 'Configurar CI/CD con GitHub Actions',
    description:
      'Implementar pipeline de CI/CD con GitHub Actions:\n\n- Build automatico en push\n- Ejecucion de tests\n- Analisis de codigo (SonarCloud)\n- Despliegue automatico (opcional)',
    priority: 5375922, // Low
    status: 12536199,
    tags: ['devops', 'ci-cd'],
  },
  {
    title: 'Configurar webhook de sincronizacion Taiga-GitHub',
    description:
      'Implementar sincronizacion automatica entre commits de GitHub y Taiga:\n\n- Detectar referencias a US en commits\n- Actualizar estado de tasks automaticamente\n- Agregar comentarios en Taiga con info del commit',
    priority: 5375922,
    status: 12536199,
    tags: ['integration', 'taiga'],
  },
];

async function main() {
  try {
    log('Autenticando en Taiga...', 'cyan');
    await taiga.login();
    log('Autenticado\n', 'green');

    const api = taiga.getApiInternal();
    const projectId = process.env.TAIGA_PROJECT_ID;

    log('Creando issues...\n', 'bright');

    for (const issue of issues) {
      try {
        log(`Creando: ${issue.title}`, 'cyan');

        const response = await api.post('/issues', {
          project: parseInt(projectId),
          subject: issue.title,
          description: issue.description,
          priority: issue.priority,
          status: issue.status,
          tags: issue.tags,
        });

        log(`   OK - Issue creado (ID: ${response.data.id})\n`, 'green');
      } catch (err) {
        log(`   Error: ${err.message}\n`, 'yellow');
      }
    }

    log('Issues creados exitosamente!', 'green');
  } catch (error) {
    log('Error: ' + error.message, 'red');
    process.exit(1);
  }
}

main();
