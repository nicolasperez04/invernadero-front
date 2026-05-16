const axios = require('axios');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');
require('dotenv').config();

const TAIGA_URL = process.env.TAIGA_URL || 'https://api.taiga.io/api/v1';
const TAIGA_AUTH_TOKEN = process.env.TAIGA_AUTH_TOKEN;
const TAIGA_PROJECT_ID = process.env.TAIGA_PROJECT_ID;
const TAIGA_USER_ALICE_ID = process.env.TAIGA_USER_ALICE_ID || '933871';
const TAIGA_USER_BOB_ID = process.env.TAIGA_USER_BOB_ID || '904750';
const TAIGA_ISSUE_TYPE_BUG = process.env.TAIGA_ISSUE_TYPE_BUG || '5388346';
const TAIGA_PRIORITY_HIGH = process.env.TAIGA_PRIORITY_HIGH || '5375924';
const TAIGA_PRIORITY_NORMAL = process.env.TAIGA_PRIORITY_NORMAL || '5375923';
const TAIGA_ISSUE_STATUS_NEW = process.env.TAIGA_ISSUE_STATUS_NEW || '12536199';

const ERROR_LOG_FILE = 'build-error.log';

const ANSI_RE = /\u001b\[[0-9;]*m/g;
const ERROR_LINE_RE = /✘\s*\[?(ERROR|TS\d+|NG\d+)?\]?\s*(.+?)(?:\s*\[plugin.*?\])?$/;
const FILE_LOC_RE = /((?:src|tools|node_modules)\/.+?)\(?:(\d+),?(\d+)?\)?/;

const typeDescriptions = {
  TS1435: 'Palabra clave o identificador desconocido',
  TS2304: 'No se puede encontrar el nombre',
  TS2552: 'No se puede encontrar el nombre. ¿Quisiste decir...?',
  TS1434: 'Palabra clave o identificador inesperado',
  TS2339: 'La propiedad no existe en el tipo',
  TS2307: 'No se puede encontrar el módulo',
  TS7008: 'Miembro con tipo implícito "any"',
  TS2741: 'Falta una propiedad requerida en el tipo',
  TS2322: 'El tipo no es asignable',
  NG8107: 'Optional chain innecesario',
};

const solutionTemplates = {
  TS1435: 'Revisar la sintaxis en la línea indicada. Posiblemente falta un `{`, `}` o `;`.',
  TS2304: 'Verificar que la variable/clase/función esté importada o declarada correctamente.',
  TS2552: 'Corregir el nombre por el correcto: `{hint}`.',
  TS2339: 'Acceder a la propiedad correcta del objeto o verificar el tipo de dato.',
  TS2307: 'Verificar que la ruta del import sea correcta y el archivo exista.',
  TS7008: 'Agregar un tipo explícito a la propiedad o inicializarla con un valor.',
  TS2741: 'Agregar la propiedad faltante al objeto.',
  TS2322: 'Cambiar el tipo del valor o declarar la variable con el tipo correcto.',
  NG8107: 'Reemplazar `?.` por `.` ya que el valor nunca es null/undefined.',
};

const fixHints = {
  TS1435: () => 'Revisar que no falte `{`, `}`, `;` o `,` en la línea señalada',
  TS7008: () => 'Agregar tipo explícito: `nombre: string` o inicializar: `nombre = ""`',
  TS2741: () => 'Agregar la propiedad faltante al objeto',
  TS2304: () => 'Importar o declarar la variable antes de usarla',
};

/* ────── Logging ────── */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m',
  bright: '\x1b[1m',
};

function log(msg, color = 'reset') { console.log(colors[color] + msg + colors.reset); }

/* ────── Helpers ────── */
function run(cmd) {
  try { return execSync(cmd, { encoding: 'utf8', timeout: 5000 }).trim(); }
  catch { return null; }
}

function stripAnsi(str) { return str.replace(ANSI_RE, ''); }

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ────── Context ────── */
function getContext() {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return {
    ngVersion: (pkg.dependencies?.['@angular/core'] || '').replace(/^\^/, '') || '?',
    nodeVersion: process.version,
    platform: `${os.type()} ${os.release()}`,
    user: os.userInfo().username,
    gitBranch: run('git branch --show-current') || run('git rev-parse --abbrev-ref HEAD') || '?',
    gitHash: run('git rev-parse --short HEAD') || '?',
    timestamp: new Date().toISOString(),
    pkgName: pkg.name || '?',
    pkgVersion: pkg.version || '?',
  };
}

/* ────── Parseador ────── */
function parseBuildOutput(raw) {
  const clean = stripAnsi(raw);
  const lines = clean.split('\n');

  const errors = [];
  const warnings = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isError = trimmed.includes('[ERROR]');
    const isWarning = trimmed.includes('[WARNING]');

    if (isError || isWarning) {
      const codeMatch = trimmed.match(/(TS\d+|NG\d+)/);
      const msgMatch = trimmed.match(/:\s*(.+?)(?:\s*\[plugin|$)/);
      const fileMatch = trimmed.match(/(src\/.+?)\(?:(\d+):(\d+)/);

      current = {
        code: codeMatch ? codeMatch[1] : '',
        message: msgMatch ? msgMatch[1].trim() : trimmed,
        file: fileMatch ? fileMatch[1] : '',
        line: fileMatch ? fileMatch[2] : '',
        col: fileMatch ? fileMatch[3] : '',
        sourceCode: '',
      };

      if (isError) errors.push(current);
      else warnings.push(current);
      continue;
    }

    if (current && trimmed.match(/^\d+\s*[│╵]/)) {
      current.sourceCode = trimmed;
      continue;
    }

    if (current && trimmed.startsWith('src/')) {
      const parts = trimmed.match(/(src\/.+?)\(?:(\d+):(\d+)/);
      if (parts) {
        current.file = parts[1];
        current.line = parts[2];
        current.col = parts[3];
      }
    }
  }

  return { errors, warnings };
}

function getSolutionMessage(error) {
  const code = error.code;
  const base = solutionTemplates[code];
  if (base) return base;

  if (error.message.includes('does not exist on type')) {
    return 'Acceder a la propiedad correcta o verificar el tipo.';
  }
  if (error.message.includes('Cannot find name')) {
    return 'Importar o declarar el nombre antes de usarlo.';
  }
  if (error.message.includes('is missing in type')) {
    return 'Agregar la propiedad faltante al objeto.';
  }
  if (error.message.includes('implicitly has an any type')) {
    return 'Agregar tipo explícito a la propiedad.';
  }
  return 'Revisar el error en la línea indicada y corregir la sintaxis.';
}

function getFixSteps(error) {
  const steps = [];
  if (error.file && error.line) {
    steps.push(`Abrir \`${error.file}\` línea **${error.line}**`);
  } else {
    steps.push('Ubicar el archivo y línea indicados');
  }

  const code = error.code;
  if (code && fixHints[code]) {
    steps.push(capitalize(fixHints[code]()));
  } else if (error.message.includes('Unknown keyword')) {
    steps.push('Revisar que no falte un símbolo (`{`, `}`, `;`, `,`) en la línea');
  } else if (error.message.includes('does not exist')) {
    steps.push('Verificar que la propiedad existe en el tipo');
  } else if (error.message.includes('Cannot find')) {
    steps.push('Verificar que el nombre esté bien escrito e importado');
  } else if (error.message.includes('missing in type')) {
    steps.push('Agregar el campo faltante al objeto');
  } else {
    steps.push('Corregir el error según el mensaje del compilador');
  }

  steps.push('Ejecutar \`npm run build\` para verificar que el error esté resuelto');

  return steps;
}

/* ────── Construcción del issue ────── */
function buildDescription(content, context, { errors, warnings }) {
  const lines = [];

  /* ── Error principal ── */
  if (errors.length > 0) {
    const e = errors[0];
    const typeLabel = typeDescriptions[e.code] || 'Error de compilación';
    lines.push(`## 🚨 Error de compilación\n`);

    const errorCount = errors.length > 1 ? ` (+${errors.length - 1} más)` : '';
    lines.push(`### ❌ Error principal${errorCount}\n`);
    lines.push('| Campo | Valor |');
    lines.push('|-------|-------|');
    lines.push(`| **Código** | \`${e.code || '—'}\` |`);
    lines.push(`| **Tipo** | ${typeLabel} |`);
    lines.push(`| **Mensaje** | ${e.message} |`);
    if (e.file) lines.push(`| **Archivo** | \`${e.file}\` |`);
    if (e.line && e.col) lines.push(`| **Línea** | ${e.line}:${e.col} |`);
    if (e.sourceCode) {
      const code = e.sourceCode.replace(/^│\s*/, '').replace(/╵\s*[~^]+\s*$/, '').trim();
      if (code) lines.push(`| **Código** | \`${code.substring(0, 60)}\` |`);
    }
    lines.push('');

    /* ── Solución ── */
    lines.push(`### 🔧 ¿Qué debo corregir?\n`);
    const sol = getSolutionMessage(e);
    lines.push(`${sol}\n`);

    const steps = getFixSteps(e);
    steps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push('');

    /* ── Errores adicionales ── */
    if (errors.length > 1) {
      lines.push(`### 📋 Otros errores (${errors.length - 1})\n`);
      for (let i = 1; i < errors.length; i++) {
        const err = errors[i];
        const loc = err.file ? ` — \`${err.file}:${err.line}\`` : '';
        lines.push(`- ${err.code ? `**${err.code}** ` : ''}${err.message}${loc}`);
      }
      lines.push('');
    }
  } else {
    lines.push(`## Build Error Report\n`);
    lines.push('No se pudieron extraer errores específicos del output del compilador.\n');
  }

  /* ── Warnings ── */
  if (warnings.length > 0) {
    lines.push(`### ⚠️ Warnings (no bloqueantes, ${warnings.length})\n`);
    for (const w of warnings) {
      const loc = w.file ? ` — \`${w.file}:${w.line}\`` : '';
      lines.push(`- ${w.code ? `**${w.code}** ` : ''}${w.message}${loc}`);
    }
    lines.push('');
  }

  /* ── Contexto ── */
  lines.push(`### 🌐 Contexto del sistema\n`);
  lines.push('| Entorno | Valor |');
  lines.push('|---------|-------|');
  lines.push(`| **Proyecto** | ${context.pkgName} v${context.pkgVersion} |`);
  lines.push(`| **Rama** | ${context.gitBranch} (${context.gitHash}) |`);
  lines.push(`| **Angular** | ${context.ngVersion} |`);
  lines.push(`| **Node.js** | ${context.nodeVersion} |`);
  lines.push(`| **SO** | ${context.platform} |`);
  lines.push(`| **Usuario** | ${context.user} |`);
  lines.push(`| **Timestamp** | ${context.timestamp} |`);
  lines.push('');

  /* ── Output completo ── */
  const cleaned = stripAnsi(content).substring(0, 3000);
  lines.push(`### 💻 Output completo del compilador\n`);
  lines.push('```');
  lines.push(cleaned);
  lines.push('```');

  return lines.join('\n');
}

/* ────── Tags ────── */
function getFileTags(content) {
  const files = new Set();
  const re = /src\/app\/(.+?\.ts)/g;
  let m;
  while ((m = re.exec(stripAnsi(content))) !== null) {
    files.add(m[1].replace(/[/\\]/g, '-').replace(/\.ts$/, ''));
  }
  const base = ['automatic', 'compile-error', 'typescript'];
  return [...base, ...Array.from(files).slice(0, 3)];
}

function getSubject(errors, date) {
  if (errors.length > 0) {
    const e = errors[0];
    const msg = e.message.replace(/'/g, '').substring(0, 55);
    if (e.code) return `[COMPILE] ${e.code}: ${msg} - ${date}`;
  }
  return `[COMPILE] Error de compilación - ${date}`;
}

/* ────── Main ────── */
async function reportBuildError() {
  if (!TAIGA_AUTH_TOKEN || !TAIGA_PROJECT_ID) {
    log('❌ Faltan variables de entorno (TAIGA_AUTH_TOKEN, TAIGA_PROJECT_ID)', 'red');
    process.exit(1);
  }

  let raw = 'Build failed - no output captured';
  try {
    if (fs.existsSync(ERROR_LOG_FILE)) {
      raw = fs.readFileSync(ERROR_LOG_FILE, 'utf8') || raw;
    }
  } catch {
    log('⚠️ No se pudo leer build-error.log, usando fallback', 'yellow');
  }

  const { errors, warnings } = parseBuildOutput(raw);
  const context = getContext();
  const description = buildDescription(raw, context, { errors, warnings });
  const date = context.timestamp.split('T')[0];
  const subject = getSubject(errors, date);
  const tags = getFileTags(raw);

  log(`\n📦 Contexto detectado:`, 'cyan');
  log(`   Rama: ${context.gitBranch}`, 'dim');
  log(`   Angular: ${context.ngVersion} / Node: ${context.nodeVersion}`, 'dim');
  log(`   Errores: ${errors.length}  |  Warnings: ${warnings.length}`, errors.length > 0 ? 'yellow' : 'dim');

  const api = axios.create({
    baseURL: TAIGA_URL,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TAIGA_AUTH_TOKEN}` },
  });

  try {
    log(`\n📝 ${subject.substring(0, 70)}...`, 'cyan');

    const response = await api.post('/issues', {
      project: parseInt(TAIGA_PROJECT_ID, 10),
      subject,
      description,
      priority: parseInt(TAIGA_PRIORITY_HIGH, 10),
      status: parseInt(TAIGA_ISSUE_STATUS_NEW, 10),
      type: parseInt(TAIGA_ISSUE_TYPE_BUG, 10),
      assigned_to: parseInt(TAIGA_USER_ALICE_ID, 10),
      tags,
    });

    log(`✅ Issue #${response.data.id} creado en Taiga`, 'green');
    log(`   Asignado: nicolasperez04 (Alice)`, 'cyan');
    log(`   Tags: ${tags.join(', ')}`, 'dim');

    if (errors.length > 0) {
      log(`\n📋 Resumen:`, 'yellow');
      log(`   • ${errors[0].code}: ${errors[0].message.substring(0, 60)}${errors[0].file ? ` en ${errors[0].file}:${errors[0].line}` : ''}`, 'dim');
      if (warnings.length > 0) log(`   • ${warnings.length} warning(s) no bloqueante(s)`, 'dim');
    }
  } catch (err) {
    const detail = err.response?.data || err.message;
    log(`❌ Error al crear issue: ${JSON.stringify(detail)}`, 'red');
    process.exit(1);
  } finally {
    try { if (fs.existsSync(ERROR_LOG_FILE)) fs.unlinkSync(ERROR_LOG_FILE); } catch { /* ignore */ }
  }
}

reportBuildError();