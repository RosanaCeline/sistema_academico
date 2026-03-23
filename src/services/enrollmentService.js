const sequelize = require('../config/database');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');

class EnrollmentService {

    async enroll(user, subject_id, student_id = null) {
        return await sequelize.transaction(async (t) => {

            let student;

            if (user.role === 'ADMIN') {

                if (!student_id) {
                    throw new Error('ID do Estudante é obrigatório para ADMIN');
                }

                student = await Student.findByPk(student_id, { transaction: t });

                if (!student) throw new Error('Aluno não encontrado');
            } else if (user.role === 'STUDENT') {

                student = await Student.findOne({
                    where: { user_id: user.id },
                    transaction: t
                });

                if (!student) throw new Error('Aluno não encontrado');
            } else {
                throw new Error('Acesso negado');
            }

            const subject = await Subject.findByPk(subject_id, { transaction: t });
            if (!subject) throw new Error('Disciplina não encontrada');

            // Evitar duplicação
            const exists = await Enrollment.findOne({
                where: { 
                    student_id: student.id, 
                    subject_id 
                },
                transaction: t
            });

            if (exists) {
                throw new Error('Aluno já matriculado nessa disciplina');
            }

            // Limite de vagas
            const count = await Enrollment.count({
                where: { subject_id },
                transaction: t
            });

            if (count >= subject.vacancies) {
                throw new Error('Limite de vagas atingido');
            }

            const enrollment = await Enrollment.create({
                student_id: student.id,
                subject_id
            }, { transaction: t });

            return enrollment;
        });
    }

    async findAll(user) {

        // Administrador vê todas as matrículas
        if (user.role === 'ADMIN') {
            return await Enrollment.findAll({
                include: [Student, Subject]
            });
        }

        // Estudante vê todas as matrículas dele
        if (user.role === 'STUDENT') {
            return await Enrollment.findAll({
                include: [Student, Subject],
                where: { '$Student.user_id$': user.id }
            });
        }

        throw new Error('Acesso negado');
    }

    async findBySubject(subject_id, user) {

        // Professor só pode ver disciplina dele
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

        return await Enrollment.findAll({
            where: { subject_id },
            include: [Student, Subject]
        });
    }

    async getMyHistory(user) {

        const student = await Student.findOne({
            where: { user_id: user.id }
        });

        if (!student) throw new Error('Aluno não encontrado');

        return await Enrollment.findAll({
            where: { student_id: student.id },
            include: [
                {
                    model: Subject
                },
                {
                    model: Grade
                },
                {
                    model: Attendance
                }
            ]
        });
    }

    async cancel(id, user) {

        const enrollment = await Enrollment.findByPk(id, {
            include: [Student]
        });

        if (!enrollment) throw new Error('Matrícula não encontrada');

        if (enrollment.status === 'CANCELLED') {
            throw new Error('Matrícula já cancelada');
        }

        if (enrollment.status === 'COMPLETED') {
            throw new Error('Não é possível cancelar uma disciplina concluída');
        }

        if (enrollment.status === 'REPROVED') {
            throw new Error('Não é possível cancelar uma disciplina reprovada');
        }

        // Estudante só cancela a própria matrícula
        if (user.role === 'STUDENT') {
            if (enrollment.student.user_id !== user.id) {
                throw new Error('Acesso negado');
            }
        }

        await enrollment.update({ status: 'CANCELLED' });

        return enrollment;
    }

    async finalize(id) {
        return await sequelize.transaction(async (t) => {

            const enrollment = await Enrollment.findByPk(id, {
                include: [Subject],
                transaction: t
            });

            if (!enrollment) {
                throw new Error('Matrícula não encontrada');
            }

            if (enrollment.status === 'CANCELLED') {
                throw new Error('Não é permitido finalizar uma matrícula cancelada');
            }

            if (enrollment.status === 'COMPLETED' || enrollment.status === 'REPROVED') {
                throw new Error('Matrícula já finalizada');
            }

            const finalGrade = await Grade.findOne({
                where: {
                    enrollment_id: id,
                    type: 'FINAL_MEDIA'
                },
                transaction: t
            });

            if (!finalGrade) {
                throw new Error('Média final ainda não calculada');
            }

            // Pegar frequência
            const attendance = await Attendance.findOne({
                where: { enrollment_id: id },
                transaction: t
            });

            if (!attendance) {
                throw new Error('Frequência ainda não lançada');
            }

            let status;

            if (finalGrade.value >= 7 && attendance.percentage >= 75) {
                status = 'COMPLETED';
            } else {
                status = 'REPROVED';
            }

            await enrollment.update(
                { status },
                { transaction: t }
            );

            return {
                enrollment_id: id,
                final_media: finalGrade.value,
                attendance: attendance.percentage,
                status
            };
        });
    }
}

module.exports = new EnrollmentService();