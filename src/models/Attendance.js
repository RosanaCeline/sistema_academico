const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Enrollment = require('./Enrollment');

// Frequência de um Aluno em uma Disciplina (Matricula)
const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        }
    }

});

Attendance.belongsTo(Enrollment, { foreignKey: 'enrollment_id' });
Enrollment.hasOne(Attendance, { foreignKey: 'enrollment_id' });

module.exports = Attendance;