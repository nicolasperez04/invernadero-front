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

  const loginRes = await api.post('/auth', {
    type: 'normal',
    username: TAIGA_USERNAME,
    password: TAIGA_PASSWORD,
  });
  
  const token = loginRes.data.auth_token;
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const proj = await api.get(`/projects/${TAIGA_PROJECT_ID}`);
  
  console.log('=== Roles ===');
  console.log(JSON.stringify(proj.data.roles, null, 2));
  
  console.log('\n=== Points ===');
  console.log(JSON.stringify(proj.data.points, null, 2));
  
  console.log('\n=== Roles with ID format ===');
  for (const role of proj.data.roles || []) {
    console.log(`Role: ${role.name}, ID: ${role.id}`);
  }
}

main().catch(console.error);