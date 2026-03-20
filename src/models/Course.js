const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Curso
const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    description: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Carga horária total do curso (ex: 3000h)
    workload: {
        type: DataTypes.INTEGER, 
        allowNull: false
    }
});

module.exports = Course;