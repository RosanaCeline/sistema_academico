const sequelize = require('../config/database');
const Attendance = require('../models/Attendance');
const Enrollment = require('../models/Enrollment');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

class AttendanceService {

    async create(data, user) {
        return await sequelize.transaction(async (t) => {

            const { enrollment_id, percentage } = data;

            const enrollment = await Enrollment.findByPk(enrollment_id, {
                include: [Subject],
                transaction: t
            });

            if (!enrollment) throw new Error('Matrícula não encontrada');

            // Professor só pode lançar frequência da disciplina dele
            if (user.role === 'TEACHER') {

                const teacher = await Teacher.findOne({
                    where: { user_id: user.id },
                    transaction: t
                });

                if (!teacher) throw new Error('Professor não encontrado');

                if (enrollment.Subject.teacher_id !== teacher.id) {
                    throw new Error('Acesso negado');
                }
            }

            // Evitar duplicidade
            const exists = await Attendance.findOne({
                where: { enrollment_id },
                transaction: t
            });

            if (exists) {
                throw new Error('Frequência já lançada para esta matrícula');
            }

            const attendance = await Attendance.create({
                enrollment_id,
                percentage
            }, { transaction: t });

            return attendance;
        });
    }

    async findByEnrollment(enrollment_id, user) {

        const enrollment = await Enrollment.findByPk(enrollment_id, {
            include: [Student, Subject]
        });

        if (!enrollment) throw new Error('Matrícula não encontrada');

        // Estudante só vê a própria frequência
        if (user.role === 'STUDENT') {
            if (enrollment.Student.user_id !== user.id) {
                throw new Error('Acesso negado');
            }
        }

        // Professor só vê as da disciplina dele
        if (user.role === 'TEACHER') {

            const teacher = await Teacher.findOne({
                where: { user_id: user.id }
            });

            if (!teacher) throw new Error('Professor não encontrado');

            if (enrollment.Subject.teacher_id !== teacher.id) {
                throw new Error('Acesso negado');
            }
        }

        return await Attendance.findOne({
            where: { enrollment_id }
        });
    }

    async findBySubject(subject_id, user) {

        // Professor só vê disciplina dele
        if (user.role === 'TEACHER') {

            const teacher = await Teacher.findOne({
                where: { user_id: user.id }
            });

            if (!teacher) throw new Error('Professor não encontrado');

            const subject = await Subject.findByPk(subject_id);

            if (!subject) throw new Error('Disciplina não encontrada');

            if (subject.teacher_id !== teacher.id) {
                throw new Error('Acesso negado');
            }
        }

        return await Attendance.findAll({
            include: [
                {
                    model: Enrollment,
                    where: { subject_id }
                }
            ]
        });
    }

    async update(id, data, user) {
        return await sequelize.transaction(async (t) => {

            const attendance = await Attendance.findByPk(id, {
                include: [{
                    model: Enrollment,
                    include: [Subject]
                }],
                transaction: t
            });

            if (!attendance) throw new Error('Frequência não encontrada');

            // Professor só pode alterar disciplina dele
            if (user.role === 'TEACHER') {

                const teacher = await Teacher.findOne({
                    where: { user_id: user.id },
                    transaction: t
                });

                if (!teacher) throw new Error('Professor não encontrado');

                if (attendance.Enrollment.Subject.teacher_id !== teacher.id) {
                    throw new Error('Acesso negado');
                }
            }

            await attendance.update(
                { percentage: data.percentage },
                { transaction: t }
            );

            return attendance;
        });
    }

    async delete(id, user) {
        return await sequelize.transaction(async (t) => {

            const attendance = await Attendance.findByPk(id, {
                include: [{
                    model: Enrollment,
                    include: [Subject]
                }],
                transaction: t
            });

            if (!attendance) throw new Error('Frequência não encontrada');

            // Professor só pode deletar disciplina dele
            if (user.role === 'TEACHER') {

                const teacher = await Teacher.findOne({
                    where: { user_id: user.id },
                    transaction: t
                });

                if (!teacher) throw new Error('Professor não encontrado');

                if (attendance.Enrollment.Subject.teacher_id !== teacher.id) {
                    throw new Error('Acesso negado');
                }
            }

            await attendance.destroy({ transaction: t });
        });
    }
}

module.exports = new AttendanceService();