const sequelize = require('../config/database');
const Subject = require('../models/Subject');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');

class SubjectService {

    async create(data) {
        return await sequelize.transaction(async (t) => {

            const course = await Course.findByPk(data.course_id, { transaction: t });
            if (!course) throw new Error('Curso não encontrado');

            if (data.teacher_id) {
                const teacher = await Teacher.findByPk(data.teacher_id, { transaction: t });
                if (!teacher) throw new Error('Professor não encontrado');
            }

            const exists = await Subject.findOne({
                where: {
                    name: data.name,
                    course_id: data.course_id
                },
                transaction: t
            });
            if (exists) throw new Error('Disciplina já cadastrada para este curso');

            const subject = await Subject.create(data, { transaction: t });

            return subject;
        });
    }

    async findAll() {
        return await Subject.findAll({
            include: [Course, Teacher]
        });
    }

    async findById(id) {
        const subject = await Subject.findByPk(id, {
            include: [Course, Teacher]
        });

        if (!subject) throw new Error('Disciplina não encontrada');

        return subject;
    }

    async update(id, data) {
        return await sequelize.transaction(async (t) => {

            const subject = await Subject.findByPk(id, { transaction: t });
            if (!subject) throw new Error('Disciplina não encontrada');

            if (data.course_id) {
                const course = await Course.findByPk(data.course_id, { transaction: t });
                if (!course) throw new Error('Curso não encontrado');
            }

            if (data.teacher_id) {
                const teacher = await Teacher.findByPk(data.teacher_id, { transaction: t });
                if (!teacher) throw new Error('Professor não encontrado');
            }

            await subject.update(data, { transaction: t });

            return subject;
        });
    }

    async delete(id) {
        return await sequelize.transaction(async (t) => {

            const subject = await Subject.findByPk(id, { transaction: t });
            if (!subject) throw new Error('Disciplina não encontrada');

            await subject.destroy({ transaction: t });
        });
    }
}

module.exports = new SubjectService();