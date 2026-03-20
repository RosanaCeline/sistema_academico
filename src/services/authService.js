const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Course = require('../models/Course');

class AuthService {

    async register(data) {
        const { name, email, password, role, ...extra } = data;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            throw new Error('Email já cadastrado');
        }

        const t = await sequelize.transaction();
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role
            }, { transaction: t });

            if (role === 'TEACHER') {
                await Teacher.create({
                    user_id: user.id,
                    specialty: extra.specialty,
                    hire_date: extra.hire_date
                }, { transaction: t });
            }

            if (role === 'STUDENT') {
                const course = await Course.findByPk(extra.course_id, { transaction: t });
                if (!course) {
                    throw new Error('Curso não encontrado');
                }

                await Student.create({
                    user_id: user.id,
                    registration: extra.registration,
                    semester: extra.semester,
                    course_id: extra.course_id
                }, { transaction: t });
            }

            await t.commit();
            return user;

        } catch (err) {
            await t.rollback();
            throw err;
        }
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error('Credenciais inválidas');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw new Error('Credenciais Inválidas');
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return {
            user,
            token
        };
    }
}

module.exports = new AuthService();