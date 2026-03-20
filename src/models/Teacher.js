const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

// Tipo de usuário: Professor
const Teacher = sequelize.define('Teacher', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },

    specialty: {
        type: DataTypes.STRING,
        allowNull: false
    },

    hire_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

Teacher.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Teacher, { foreignKey: 'user_id' });

module.exports = Teacher;