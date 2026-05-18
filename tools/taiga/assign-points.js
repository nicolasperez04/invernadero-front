const taiga = require('./taiga.js');

const storyPoints = {
  9247053: { module: 'AUTH', points: 5, reason: 'JWT + Security + RBAC' },
  9247039: { module: 'USR', points: 8, reason: 'CRUD + roles + validaciones' },
  9247017: { module: 'CRP', points: 5, reason: 'CRUD + validaciones' },
  9247055: {
    module: 'LOT',
    points: 13,
    reason: 'CRUD + cálculos estados + inactividad + progreso',
  },
  9247056: { module: 'EVT', points: 13, reason: 'CRUD + validación secuencia + trazabilidad' },
  9247054: { module: 'EVT-TYPE', points: 3, reason: 'Catálogo simple' },
  9247057: { module: 'DSH', points: 8, reason: 'Métricas + gráficos + time real' },
};

async function main() {
  try {
    console.log('🔐 Autenticando en Taiga...');
    await taiga.login();
    console.log('✅ Autenticado\n');

    console.log('📊 Asignando Story Points...\n');

    let totalPoints = 0;
    const stories = await taiga.getUserStories();

    for (const us of stories) {
      const info = storyPoints[us.id];
      if (info) {
        console.log(`   ${info.module}: ${info.points} pts - ${info.reason}`);
        console.log(`      User Story: ${us.subject.substring(0, 40)}... (ID: ${us.id})`);
        await taiga.updateUserStoryPoints(us.id, info.points);
        totalPoints += info.points;
        console.log(`      ✅ Asignado: ${info.points} puntos\n`);
      } else {
        console.log(`   ⚠️ Sin asignar: ${us.subject.substring(0, 40)}... (ID: ${us.id})`);
      }
    }

    console.log('='.repeat(50));
    console.log(`\n✅ Story Points asignados`);
    console.log(`   Total de puntos: ${totalPoints}`);
    console.log(`   Total de User Stories: ${Object.keys(storyPoints).length}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
