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
  const userId = loginRes.data.id;
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const usId = 9247039;
  const us = await api.get(`/userstories/${usId}`);
  
  console.log('Current points:', us.data.points);
  console.log('Current user ID:', userId);
  console.log('Version:', us.data.version);

  const proj = await api.get(`/projects/${TAIGA_PROJECT_ID}`);
  const pointId = proj.data.points.find(p => p.value === 8)?.id;
  console.log('Point ID for 8:', pointId);

  const newPoints = { ...us.data.points };
  newPoints[userId] = pointId;
  console.log('New points object:', newPoints);

  console.log('\n=== Trying PATCH ===');
  try {
    const res = await api.patch(`/userstories/${usId}`, {
      points: newPoints,
      version: us.data.version,
    });
    console.log('Success:', res.data.points);
  } catch (err) {
    console.log('Error:', err.response?.status, err.response?.data);
  }
}

main().catch(console.error);