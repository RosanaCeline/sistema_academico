const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Course = require('./Course');
const Teacher = require('./Teacher');

// Disciplina
const Subject = sequelize.define('Subject', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Carga horária da disciplina (ex: 40h)
    workload: {
        type: DataTypes.INTEGER, 
        allowNull: true
    },

    // Qtd de vagas 
    vacancies: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            isInt: true
        }
    }
});


Subject.belongsTo(Course, { foreignKey: 'course_id' });
Course.hasMany(Subject, { foreignKey: 'course_id' });

Subject.belongsTo(Teacher, { foreignKey: 'teacher_id' });
Teacher.hasMany(Subject, { foreignKey: 'teacher_id' });

module.exports = Subject;