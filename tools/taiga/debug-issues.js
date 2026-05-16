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

  console.log('Auth...');
  const loginRes = await api.post('/auth', {
    type: 'normal',
    username: TAIGA_USERNAME,
    password: TAIGA_PASSWORD,
  });
  api.defaults.headers.common['Authorization'] = `Bearer ${loginRes.data.auth_token}`;
  console.log('OK');

  console.log('\n--- Checking project settings ---');
  const proj = await api.get(`/projects/${TAIGA_PROJECT_ID}`);
  console.log('is_issues_activated:', proj.data.is_issues_activated);
  console.log('issue_statuses:', proj.data.issue_statuses);
  console.log('priorities:', proj.data.priorities);

  console.log('\n--- Trying to create issue with different format ---');
  try {
    const res = await api.post('/issues', {
      project: parseInt(TAIGA_PROJECT_ID),
      subject: 'Test issue',
      description: 'Test description',
    });
    console.log('Created:', res.data.id);
  } catch (e) {
    console.log('Error:', e.response?.status, e.response?.data);
  }
}

main().catch(console.error);