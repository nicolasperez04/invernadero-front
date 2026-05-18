const axios = require('axios');
require('dotenv').config();

const TAIGA_URL = process.env.TAIGA_URL || 'https://api.taiga.io/api/v1';
const TAIGA_USERNAME = process.env.TAIGA_USERNAME;
const TAIGA_PASSWORD = process.env.TAIGA_PASSWORD;
const TAIGA_PROJECT_ID = process.env.TAIGA_PROJECT_ID;

async function main() {
  const api = axios.create({
    baseURL: TAIGA_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  console.log('Autenticando...');
  const loginRes = await api.post('/auth', {
    type: 'normal',
    username: TAIGA_USERNAME,
    password: TAIGA_PASSWORD,
  });
  const token = loginRes.data.auth_token;
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log('Autenticado');

  console.log('\n--- Debug: Obtener proyecto ---');
  const proj = await api.get(`/projects/${TAIGA_PROJECT_ID}`);
  console.log('Proyecto:', proj.data.name);
  console.log('Task states:', proj.data.task_states);
  console.log('Keys disponibles:', Object.keys(proj.data));

  console.log('\n--- Debug: Endpoints de tasks ---');
  try {
    const res1 = await api.get(`/projects/${TAIGA_PROJECT_ID}/tasks`);
    console.log('GET /tasks: OK, total:', res1.data.length);
  } catch (e) {
    console.log('GET /tasks:', e.message);
  }

  try {
    const res2 = await api.get(`/tasks`);
    console.log('GET /tasks: OK');
  } catch (e) {
    console.log('GET /tasks:', e.message);
  }
}

main().catch(console.error);
