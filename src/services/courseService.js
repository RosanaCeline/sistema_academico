const sequelize = require('../config/database');
const Course = require('../models/Course');

class CourseService {

    async create(data) {
        const t = await sequelize.transaction();

        try {
            const { name } = data;

            const courseExists = await Course.findOne({ 
                where: { name },
                transaction: t
            });

            if (courseExists) {
                throw new Error('Curso já cadastrado');
            }

            const course = await Course.create(data, { transaction: t });

            await t.commit();
            return course;

        } catch (err) {
            await t.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Curso já cadastrado');
            }

            throw err;
        }
    }

    async findAll() {
        return await Course.findAll();
    }

    async findById(id) {
        const course = await Course.findByPk(id);
        if (!course) throw new Error('Curso não encontrado');
        return course;
    }

    async update(id, data) {
        const t = await sequelize.transaction();

        try {
            const course = await Course.findByPk(id, { transaction: t });
            if (!course) throw new Error('Curso não encontrado');

            if (data.name) {
                const exists = await Course.findOne({ 
                    where: { name: data.name },
                    transaction: t
                });

                if (exists && exists.id !== course.id) {
                    throw new Error('Curso com esse nome já existe');
                }
            }

            await course.update(data, { transaction: t });

            await t.commit();
            return course;

        } catch (err) {
            await t.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Curso com esse nome já existe');
            }

            throw err;
        }
    }

    async delete(id) {
        const t = await sequelize.transaction();

        try {
            const course = await Course.findByPk(id, { transaction: t });
            if (!course) throw new Error('Curso não encontrado');

            await course.destroy({ transaction: t });

            await t.commit();
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }
}

module.exports = new CourseService();