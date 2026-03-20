const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Subject = require('./Subject');

// Matriculas 
const Enrollment = sequelize.define('Enrollment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
  indexes: [
    {
      unique: true, // evita matrícula duplicada
      fields: ['student_id', 'subject_id'] 
    }
  ]
});

Enrollment.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(Enrollment, { foreignKey: 'student_id' });

Enrollment.belongsTo(Subject, { foreignKey: 'subject_id' });
Subject.hasMany(Enrollment, { foreignKey: 'subject_id' });

module.exports = Enrollment;