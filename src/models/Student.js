const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');

// Tipo de usuário: Estudante
const Student = sequelize.define('Student', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },

    // Matricula
    registration: { 
        type: DataTypes.STRING, 
        unique: true,
        allowNull: false,
    },

    semester: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'GRADUATED'),
        defaultValue: 'ACTIVE'
    }
});

Student.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Student, { foreignKey: 'user_id' });

Student.belongsTo(Course, { foreignKey: 'course_id' });
Course.hasMany(Student, { foreignKey: 'course_id' });

module.exports = Student;