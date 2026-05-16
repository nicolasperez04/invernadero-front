const taiga = require('./taiga.js');

async function main() {
  try {
    console.log('🔐 Autenticando en Taiga...');
    await taiga.login();
    console.log('✅ Autenticado\n');

    console.log('📋 Asignando todas las User Stories y Tasks a ti...\n');

    const stories = await taiga.getUserStories();
    console.log(`   User Stories encontradas: ${stories.length}\n`);

    let usAssigned = 0;
    let tasksAssigned = 0;

    for (const story of stories) {
      console.log(`   Asignando US: "${story.subject.substring(0, 40)}..." (ID: ${story.id})`);
      await taiga.assignUserStoryToMe(story.id);
      usAssigned++;
      console.log(`      ✅ US asignada\n`);

      const tasks = await taiga.getTasks(story.id);
      console.log(`      Tasks en esta US: ${tasks.length}`);
      
      for (const task of tasks) {
        await taiga.assignTaskToMe(task.id);
        tasksAssigned++;
        console.log(`         ✅ Task: "${task.subject.substring(0, 30)}..."`);
      }
      if (tasks.length > 0) console.log('');
    }

    console.log('='.repeat(50));
    console.log('\n✅ Asignación completada!');
    console.log(`   User Stories asignadas: ${usAssigned}`);
    console.log(`   Tasks asignadas: ${tasksAssigned}`);
    console.log(`   Total: ${usAssigned + tasksAssigned} elementos`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();