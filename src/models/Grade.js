const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Enrollment = require('./Enrollment');

// Notas
const Grade = sequelize.define('Grade', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 10
        }
    }

});

Grade.belongsTo(Enrollment, { foreignKey: 'enrollment_id' });
Enrollment.hasOne(Grade, { foreignKey: 'enrollment_id' });

module.exports = Grade;