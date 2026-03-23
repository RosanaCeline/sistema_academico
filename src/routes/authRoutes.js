const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { registerValidator, loginValidator } = require('../validators/authValidator');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Funcionalidades de autenticação de usuário
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Auth]
 *     description: |
 *       Cria um usuário com perfil de:
 *       - STUDENT → requer registration e course_id
 *       - TEACHER → requer specialty e hire_date
 *       - ADMIN → não requer campos adicionais
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   name: { type: string }
 *                   email: { type: string }
 *                   password: { type: string }
 *                   role: { type: string, enum: [STUDENT] }
 *                   registration: { type: integer }
 *                   semester: { type: integer }
 *                   course_id: { type: integer }

 *               - type: object
 *                 properties:
 *                   name: { type: string }
 *                   email: { type: string }
 *                   password: { type: string }
 *                   role: { type: string, enum: [TEACHER] }
 *                   specialty: { type: string }
 *                   hire_date: { type: string, format: date }

 *               - type: object
 *                 properties:
 *                   name: { type: string }
 *                   email: { type: string }
 *                   password: { type: string }
 *                   role: { type: string, enum: [ADMIN] }

 *           examples:
 *             student:
 *               summary: Cadastro de Estudante
 *               value:
 *                 name: João Silva
 *                 email: joao@gmail.com
 *                 password: abcdef
 *                 role: STUDENT
 *                 registration: 202300123
 *                 semester: 3
 *                 course_id: 1

 *             teacher:
 *               summary: Cadastro de Professor
 *               value:
 *                 name: Maria Souza
 *                 email: maria@gmail.com
 *                 password: abcdef
 *                 role: TEACHER
 *                 specialty: Matemática
 *                 hire_date: 2024-02-10

 *             admin:
 *               summary: Cadastro de Admin
 *               value:
 *                 name: Admin Master
 *                 email: admin@gmail.com
 *                 password: abcdef
 *                 role: ADMIN

 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/register', validate(registerValidator), AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Auth]
 *     description: Autentica o usuário e retorna um token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@gmail.com
 *               password:
 *                 type: string
 *                 example: abcdef
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', validate(loginValidator), AuthController.login);

module.exports = router;