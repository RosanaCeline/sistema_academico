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
    },

    type: {
        type: DataTypes.ENUM('AV1', 'AV2', 'FINAL_MEDIA'),
        allowNull: false
    }
});

Grade.belongsTo(Enrollment, { foreignKey: 'enrollment_id' });
Enrollment.hasMany(Grade, { foreignKey: 'enrollment_id' });

module.exports = Grade;