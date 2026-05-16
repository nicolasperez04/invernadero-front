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

  const usId = 9247017;
  const us = await api.get(`/userstories/${usId}`);
  
  console.log('=== User Story Data ===');
  console.log('ID:', us.data.id);
  console.log('Subject:', us.data.subject);
  console.log('Points:', us.data.points);
  console.log('Total Points:', us.data.total_points);
  console.log('Version:', us.data.version);
  console.log('Status:', us.data.status);
  
  const proj = await api.get(`/projects/${TAIGA_PROJECT_ID}`);
  console.log('\n=== Project Points Config ===');
  console.log(JSON.stringify(proj.data.points, null, 2));

  console.log('\n=== Trying PUT with full data ===');
  const fullUpdate = {
    project: proj.data.id,
    subject: us.data.subject,
    description: us.data.description || '',
    status: us.data.status,
    version: us.data.version,
  };
  
  try {
    const res = await api.put(`/userstories/${usId}`, fullUpdate);
    console.log('PUT response:', res.data);
  } catch (err) {
    console.log('PUT error:', err.response?.data || err.message);
  }
}

main().catch(console.error);