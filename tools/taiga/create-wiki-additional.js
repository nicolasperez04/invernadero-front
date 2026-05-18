const taiga = require('./taiga.js');
const fs = require('fs');

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

async function main() {
  try {
    log('Cargando paginas de Wiki...', 'cyan');
    const pagesData = fs.readFileSync(__dirname + '/wiki-content.json', 'utf8');
    const additionalWikiPages = JSON.parse(pagesData);
    log(`Cargadas ${additionalWikiPages.length} paginas\n`, 'green');

    log('Autenticando en Taiga...', 'cyan');
    await taiga.login();
    log('Autenticado\n', 'green');

    const api = taiga.getApiInternal();
    const projectId = process.env.TAIGA_PROJECT_ID;

    log('Creando paginas de Wiki adicionales...\n', 'bright');

    let created = 0;
    let skipped = 0;

    for (const page of additionalWikiPages) {
      try {
        log(`Creando: ${page.title}`, 'cyan');

        try {
          await api.post('/wiki', {
            project: parseInt(projectId),
            slug: page.slug,
            content: page.content,
          });
          log(`   OK - Pagina creada`, 'green');
          created++;
        } catch (err) {
          if (err.response?.status === 400) {
            log(`   La pagina ya existe, saltando...`, 'yellow');
            skipped++;
          } else {
            log(`   Error: ${err.message}`, 'yellow');
          }
        }
      } catch (e) {
        log(`   Error: ${e.message}`, 'yellow');
      }
    }

    console.log('');
    log('=== Resumen ===', 'bright');
    log(`Creadas: ${created}`, 'green');
    log(`Omitidas (ya existen): ${skipped}`, 'yellow');
    log('Wiki adicional completado!', 'green');
  } catch (error) {
    log('Error: ' + error.message, 'red');
    process.exit(1);
  }
}

main();
