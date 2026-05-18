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

  console.log('🔐 Autenticando en Taiga...');
  const loginRes = await api.post('/auth', {
    type: 'normal',
    username: TAIGA_USERNAME,
    password: TAIGA_PASSWORD,
  });
  const token = loginRes.data.auth_token;
  const userId = loginRes.data.id;
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log('✅ Autenticado\n');

  const sprints = [
    { id: 517872, name: 'Sprint 1 - Seguridad', stories: [9247039, 9247053] },
    { id: 517873, name: 'Sprint 2 - Cultivos y Lotes', stories: [9247055, 9247017] },
    { id: 517874, name: 'Sprint 3 - Eventos', stories: [9247056] },
    { id: 517875, name: 'Sprint 4 - Dashboard', stories: [9247054, 9247057] },
  ];

  console.log('📋 Asignando User Stories a sprints (versión corregida)...\n');

  for (const sprint of sprints) {
    console.log(`📦 ${sprint.name} (ID: ${sprint.id})`);

    for (const usId of sprint.stories) {
      try {
        const usRes = await api.get(`/userstories/${usId}`);
        const us = usRes.data;

        console.log(`   📝 US #${usId}: "${us.subject.substring(0, 40)}..."`);
        console.log(`      Estado actual: ${us.status_extra_info?.name}`);
        console.log(`      Milestone actual: ${us.milestone}`);

        const updateRes = await api.patch(`/userstories/${usId}`, {
          milestone: sprint.id,
          version: us.version,
        });

        const updated = updateRes.data;
        console.log(
          `      ✅ Asignada a sprint ${sprint.id} (nuevo milestone: ${updated.milestone})`,
        );
      } catch (err) {
        console.log(`      ⚠️ Error: ${err.response?.status} - ${err.response?.statusText}`);
      }
    }
    console.log('');
  }

  console.log('✅ Verificando asignación final...');

  const userStories = await api.get('/userstories', {
    params: { project: parseInt(TAIGA_PROJECT_ID, 10) },
  });

  console.log('\n📊 Estado final de User Stories:');
  for (const us of userStories.data) {
    console.log(`   #${us.ref} ${us.subject.substring(0, 35)}...`);
    console.log(
      `      Sprint: ${us.milestone || 'Sin asignar'} | Estado: ${us.status_extra_info?.name}`,
    );
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
