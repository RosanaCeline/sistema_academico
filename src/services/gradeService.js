const sequelize = require('../config/database');
const Grade = require('../models/Grade');
const Enrollment = require('../models/Enrollment');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject')

class GradeService {

    async create(data) {
        return await sequelize.transaction(async (t) => {

            const { enrollment_id, type, value } = data;

            const enrollment = await Enrollment.findByPk(enrollment_id, { transaction: t });
            if (!enrollment) throw new Error('Matrícula não encontrada');

            if (type === 'FINAL_MEDIA') {
                throw new Error('Média Final é gerada automaticamente');
            }

            // Evitar duplicidade (ex: duas AV1)
            const exists = await Grade.findOne({
                where: { enrollment_id, type },
                transaction: t
            });

            if (exists) {
                throw new Error(`Já existe nota do tipo ${type}`);
            }

            const grade = await Grade.create({
                enrollment_id,
                type,
                value
            }, { transaction: t });

            // Recalcula média
            await this.recalculateFinalMedia(enrollment_id, t);

            return grade;
        });
    }

    async findByEnrollment(enrollment_id, user) {
        const enrollment = await Enrollment.findByPk(enrollment_id, {
            include: ['Student', 'Subject']
        });

        if (!enrollment) {
            throw new Error('Matrícula não encontrada');
        }

        // Estudante só vê a própria matrícula
        if (user.role === 'STUDENT') {
            if (enrollment.Student.user_id !== user.id) {
                throw new Error('Acesso negado');
            }
        }

        // Professor só vê uma matrícula de uma disciplina dele
        if (user.role === 'TEACHER') {
            const teacher = await Teacher.findOne({
                where: { user_id: user.id }
            });

            if (!teacher) throw new Error('Professor não encontrado');

            if (enrollment.Subject.teacher_id !== teacher.id) {
                throw new Error('Acesso negado');
            }
        }

        return await Grade.findAll({
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

        return await Grade.findAll({
            include: [
                {
                    model: Enrollment,
                    where: { subject_id }
                }
            ]
        });
    }

    async update(id, data) {
        return await sequelize.transaction(async (t) => {

            const grade = await Grade.findByPk(id, {
                include: [Enrollment],
                transaction: t
            });

            if (!grade) throw new Error('Nota não encontrada');

            if (grade.type === 'FINAL_MEDIA') {
                throw new Error('Não é permitido alterar a média final');
            }

            if (grade.Enrollment.status === 'COMPLETED') {
                throw new Error('Não é permitido alterar notas de uma matrícula concluída');
            }

            if (grade.Enrollment.status === 'REPROVED') {
                throw new Error('Não é permitido alterar notas de uma matrícula reprovada');
            }

            if (grade.Enrollment.status === 'CANCELLED') {
                throw new Error('Não é permitido alterar notas de uma matrícula cancelada');
            }

            const { value } = data;

            await grade.update(
                { value },
                { transaction: t }
            )

            // Recalcula média
            await this.recalculateFinalMedia(grade.enrollment_id, t);

            return grade;
        });
    }

    async delete(id) {
        return await sequelize.transaction(async (t) => {

            const grade = await Grade.findByPk(id, {
                include: [Enrollment],
                transaction: t
            });

            if (!grade) throw new Error('Nota não encontrada');

            if (grade.type === 'FINAL_MEDIA') {
                throw new Error('Não é permitido deletar a média final');
            }

            if (grade.Enrollment.status === 'COMPLETED') {
                throw new Error('Não é permitido deletar notas de uma matrícula concluída');
            }

            if (grade.Enrollment.status === 'REPROVED') {
                throw new Error('Não é permitido deletar notas de uma matrícula reprovada');
            }

            const enrollment_id = grade.enrollment_id;

            await grade.destroy({ transaction: t });

            // Recalcula média
            await this.recalculateFinalMedia(enrollment_id, t);
        });
    }

    async recalculateFinalMedia(enrollment_id, transaction) {

        const grades = await Grade.findAll({
            where: { enrollment_id },
            transaction
        });

        const av1 = grades.find(g => g.type === 'AV1');
        const av2 = grades.find(g => g.type === 'AV2');

        // Se não tiver as duas, remove média se existir
        if (!av1 || !av2) {
            const existingFinal = grades.find(g => g.type === 'FINAL_MEDIA');

            if (existingFinal) {
                await existingFinal.destroy({ transaction });
            }

            return;
        }

        const media = (av1.value + av2.value) / 2;

        const existingFinal = grades.find(g => g.type === 'FINAL_MEDIA');

        if (existingFinal) {
            await existingFinal.update(
                { value: media },
                { transaction }
            );
        } else {
            await Grade.create({
                enrollment_id,
                type: 'FINAL_MEDIA',
                value: media
            }, { transaction });
        }
    }
}

module.exports = new GradeService();