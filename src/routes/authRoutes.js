const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


const { registerValidator, loginValidator } = require('../validators/authValidator');
const validate = require('../middlewares/validate');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Auth]
 *     description: Cria um usuário com perfil de aluno, professor ou admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - name
 *              - email
 *              - password
 *              - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva Carvalho
 *               email:
 *                 type: string
 *                 example: joao@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum: [STUDENT, TEACHER, ADMIN]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/register', registerValidator, validate, authController.register);

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
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', loginValidator, validate, authController.login);

module.exports = router;