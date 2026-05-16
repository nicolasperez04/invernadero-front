const axios = require('axios');
require('dotenv').config();

const TAIGA_URL = process.env.TAIGA_URL || 'https://api.taiga.io/api/v1';
const TAIGA_USERNAME = process.env.TAIGA_USERNAME;
const TAIGA_PASSWORD = process.env.TAIGA_PASSWORD;
const TAIGA_PROJECT_ID = process.env.TAIGA_PROJECT_ID;

let token = null;
let api = null;
let currentUserId = null;
let inProgressStatusId = null;
let usInProgressStatusId = null;

function getApi() {
  if (!api) {
    api = axios.create({
      baseURL: TAIGA_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return api;
}

async function login() {
  if (token) {
    return token;
  }

  if (!TAIGA_USERNAME || !TAIGA_PASSWORD) {
    throw new Error('Credenciales de Taiga no configuradas en .env');
  }

  const response = await getApi().post('/auth', {
    type: 'normal',
    username: TAIGA_USERNAME,
    password: TAIGA_PASSWORD,
  });

  token = response.data.auth_token;
  currentUserId = response.data.id;
  getApi().defaults.headers.common['Authorization'] = `Bearer ${token}`;

  await loadProjectStatuses();

  return token;
}

async function loadProjectStatuses() {
  try {
    const projectId = parseInt(TAIGA_PROJECT_ID, 10);
    const response = await getApi().get(`/projects/${projectId}`);
    const data = response.data;

    let taskStatuses = [];
    if (data.task_states) {
      taskStatuses = data.task_states;
    } else if (data.tasks_settings && data.tasks_settings.states) {
      taskStatuses = data.tasks_settings.states;
    }

    for (const status of taskStatuses) {
      const name = (status.name || status).toString().toLowerCase();
      if (name.includes('progress') || name.includes('desarrollo') || name.includes('inprogress')) {
        inProgressStatusId = status.id || status;
        break;
      }
    }
    if (!inProgressStatusId && taskStatuses.length > 0) {
      inProgressStatusId = taskStatuses[0].id || taskStatuses[0];
    }

    let usStatuses = [];
    if (data.us_statuses) {
      usStatuses = data.us_statuses;
    } else if (data.user_stories_settings && data.user_stories_settings.statuses) {
      usStatuses = data.user_stories_settings.statuses;
    }

    for (const status of usStatuses) {
      const name = (status.name || status).toString().toLowerCase();
      if (name.includes('progress') || name.includes('desarrollo') || name.includes('inprogress') || name.includes('started')) {
        usInProgressStatusId = status.id || status;
        break;
      }
    }
    if (!usInProgressStatusId && usStatuses.length > 0) {
      usInProgressStatusId = usStatuses[0].id || usStatuses[0];
    }
  } catch (err) {
    console.log('⚠️ No se pudieron cargar estados, se omitirá asignación');
  }
}

async function checkUserStoryExists(title) {
  const projectId = parseInt(TAIGA_PROJECT_ID, 10);
  const response = await getApi().get('/userstories', {
    params: {
      project: projectId,
    },
  });

  const stories = response.data;
  for (const story of stories) {
    if (story.subject === title) {
      return story.id;
    }
  }
  return null;
}

async function createUserStory(title, description = '') {
  if (!TAIGA_PROJECT_ID) {
    throw new Error('TAIGA_PROJECT_ID no configurado en .env');
  }

  const existingId = await checkUserStoryExists(title);
  if (existingId) {
    console.log(`   ⚠️ User Story ya existe: "${title}" (ID: ${existingId})`);
    return existingId;
  }

  const usData = {
    project: parseInt(TAIGA_PROJECT_ID, 10),
    subject: title,
  };

  if (description) {
    usData.description = description;
  }

  if (usInProgressStatusId) {
    usData.status = usInProgressStatusId;
  }

  const response = await getApi().post('/userstories', usData);

  return response.data.id;
}

async function checkTaskExists(userStoryId, subject) {
  const response = await getApi().get('/tasks', {
    params: {
      user_story: userStoryId,
    },
  });

  const tasks = response.data;
  for (const task of tasks) {
    if (task.subject === subject) {
      return task.id;
    }
  }
  return null;
}

async function createTask(userStoryId, subject) {
  const existingTaskId = await checkTaskExists(userStoryId, subject);
  if (existingTaskId) {
    console.log(`   ⚠️ Task ya existe: "${subject}" (ID: ${existingTaskId})`);
    return existingTaskId;
  }

  const taskData = {
    project: parseInt(TAIGA_PROJECT_ID, 10),
    user_story: userStoryId,
    subject: subject,
    assigned_to: currentUserId,
  };

  if (inProgressStatusId) {
    taskData.status = inProgressStatusId;
  }

  const response = await getApi().post('/tasks', taskData);

  return response.data.id;
}

function getProjectId() {
  return TAIGA_PROJECT_ID;
}

async function deleteUserStory(userStoryId) {
  await getApi().delete(`/userstories/${userStoryId}`);
  console.log(`   🗑️ User Story ID ${userStoryId} eliminada`);
}

async function createSprint(name, startDate, endDate) {
  try {
    console.log(`      Debug - Creando sprint:`, { name, startDate, endDate });
    const response = await getApi().post('/milestones', {
      project: parseInt(TAIGA_PROJECT_ID, 10),
      name: name,
      estimated_start: startDate,
      estimated_finish: endDate,
    });
    return response.data.id;
  } catch (err) {
    console.log(`      Debug - Error:`, err.response?.data || err.message);
    throw err;
  }
}

async function getUserStories() {
  const response = await getApi().get('/userstories', {
    params: { project: parseInt(TAIGA_PROJECT_ID, 10) },
  });
  return response.data;
}

async function updateUserStoryStatus(userStoryId, statusId) {
  const response = await getApi().get(`/userstories/${userStoryId}`);
  const us = response.data;
  
  await getApi().put(`/userstories/${userStoryId}`, {
    project: us.project,
    subject: us.subject,
    description: us.description || '',
    status: statusId,
    version: us.version,
  });
}

async function getUserStoryStatuses() {
  const response = await getApi().get(`/projects/${TAIGA_PROJECT_ID}`);
  return response.data.us_statuses || response.data.user_stories_settings?.statuses || [];
}

async function addUserStoryToSprint(sprintId, userStoryId) {
  const response = await getApi().get(`/userstories/${userStoryId}`);
  const us = response.data;
  
  await getApi().patch(`/userstories/${userStoryId}`, {
    milestone: sprintId,
    version: us.version,
  });
}

let projectRoles = null;

async function loadProjectRoles() {
  if (projectRoles) return projectRoles;
  
  const projResponse = await getApi().get(`/projects/${TAIGA_PROJECT_ID}`);
  projectRoles = (projResponse.data.roles || []).filter(r => r.computable);
  return projectRoles;
}

async function updateUserStoryPoints(userStoryId, points) {
  const response = await getApi().get(`/userstories/${userStoryId}`);
  const us = response.data;
  
  const projResponse = await getApi().get(`/projects/${TAIGA_PROJECT_ID}`);
  const pointsConfig = projResponse.data.points;
  
  let pointId = null;
  if (pointsConfig && Array.isArray(pointsConfig)) {
    for (const p of pointsConfig) {
      if (p.value === points) {
        pointId = p.id;
        break;
      }
    }
  }
  
  const roles = await loadProjectRoles();
  
  if (pointId && roles.length > 0) {
    const pointsObj = {};
    for (const role of roles) {
      pointsObj[role.id] = pointId;
    }
    
    await getApi().patch(`/userstories/${userStoryId}`, {
      points: pointsObj,
      version: us.version,
    });
  } else {
    throw new Error('No se pudieron obtener los datos necesarios para asignar puntos');
  }
}

async function assignUserStoryToMe(userStoryId) {
  const response = await getApi().get(`/userstories/${userStoryId}`);
  const us = response.data;
  
  await getApi().patch(`/userstories/${userStoryId}`, {
    assigned_to: currentUserId,
    version: us.version,
  });
}

async function getTasks(userStoryId) {
  const response = await getApi().get('/tasks', {
    params: { user_story: userStoryId },
  });
  return response.data;
}

async function assignTaskToMe(taskId) {
  const response = await getApi().get(`/tasks/${taskId}`);
  const task = response.data;
  
  await getApi().patch(`/tasks/${taskId}`, {
    assigned_to: currentUserId,
    version: task.version,
  });
}

function getApiInternal() {
  return getApi();
}

module.exports = { 
  login, 
  createUserStory, 
  createTask, 
  getProjectId, 
  deleteUserStory, 
  createSprint, 
  getUserStories, 
  addUserStoryToSprint,
  updateUserStoryStatus,
  getUserStoryStatuses,
  updateUserStoryPoints,
  assignUserStoryToMe,
  getTasks,
  assignTaskToMe,
  getApiInternal
};