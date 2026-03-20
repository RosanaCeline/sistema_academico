const sequelize = require('../config/database');
const Course = require('../models/Course');

// node src/scripts/populateCourses.js
async function populate() {
  await sequelize.sync();

  const courses = [
    { 
        name: 'Engenharia de Software', 
        description: 'Curso de Engenharia de Software',
        workload: 3.200
    },
    { 
        name: 'Ciência da Computação', 
        description: 'Curso de Computação',
        workload: 3.600
    },
    { 
        name: 'Design', 
        description: 'Curso de Design',
        workload: 3.000
    },
  ];

  for (const c of courses) {
    await Course.create(c);
  }

  console.log('Cursos criados!');
  process.exit();
}

populate().catch(err => console.error(err));