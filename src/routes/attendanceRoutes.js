const express = require('express');
const router = express.Router();

const AttendanceController = require('../controllers/attendanceController');
const validate = require('../middlewares/validate');
const { attendanceCreateSchema, attendanceUpdateSchema } = require('../validators/attendanceValidator');

const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Attendances
 *   description: Gerenciamento de frequências de alunos
 */

/**
 * @swagger
 * /attendances:
 *   post:
 *     summary: Lançar frequência final de um aluno
 *     tags: [Attendances]
 *     description: Apenas professores podem lançar a frequência final de uma matrícula
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - enrollment_id
 *               - percentage
 *             properties:
 *               enrollment_id:
 *                 type: integer
 *                 example: 1
 *               percentage:
 *                 type: number
 *                 example: 85.5
 *     responses:
 *       201:
 *         description: Frequência lançada com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 */
router.post('/', auth, role(['TEACHER']), validate(attendanceCreateSchema), AttendanceController.create);

/**
 * @swagger
 * /attendances/enrollment/{enrollment_id}:
 *   get:
 *     summary: Ver frequência de uma matrícula
 *     tags: [Attendances]
 *     description: |
 *       Retorna a frequência de uma matrícula.
 *       - Estudante só pode ver a própria frequência
 *       - Professor apenas da disciplina dele
 *       - Administrador pode ver todas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollment_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula
 *     responses:
 *       200:
 *         description: Frequência encontrada
 *       400:
 *         description: Erro de validação
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Matrícula não encontrada
 */
router.get('/enrollment/:enrollment_id', auth, role(['TEACHER', 'ADMIN', 'STUDENT']), AttendanceController.findByEnrollment);

/**
 * @swagger
 * /attendances/subject/{subject_id}:
 *   get:
 *     summary: Listar frequências de uma disciplina
 *     tags: [Attendances]
 *     description: |
 *       Retorna todas as frequências dos alunos de uma disciplina.
 *       - Professor apenas disciplinas dele
 *       - Administrador pode ver todas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subject_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *     responses:
 *       200:
 *         description: Lista de frequências
 *       400:
 *         description: Erro de validação
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Disciplina não encontrada
 */
router.get('/subject/:subject_id', auth, role(['TEACHER', 'ADMIN']), AttendanceController.findBySubject);

/**
 * @swagger
 * /attendances/{id}:
 *   put:
 *     summary: Atualizar frequência
 *     tags: [Attendances]
 *     description: Apenas professores podem atualizar a frequência
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da frequência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - percentage
 *             properties:
 *               percentage:
 *                 type: number
 *                 example: 90
 *     responses:
 *       200:
 *         description: Frequência atualizada com sucesso
 *       400:
 *         description: Erro de validação
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Frequência não encontrada
 */
router.put('/:id', auth, role(['TEACHER']), validate(attendanceUpdateSchema), AttendanceController.update);

/**
 * @swagger
 * /attendances/{id}:
 *   delete:
 *     summary: Deletar frequência
 *     tags: [Attendances]
 *     description: Apenas professores podem deletar a frequência
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da frequência
 *     responses:
 *       204:
 *         description: Frequência deletada com sucesso
 *       400:
 *         description: Erro de validação
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Frequência não encontrada
 */
router.delete('/:id', auth, role(['TEACHER']), AttendanceController.delete);

module.exports = router;