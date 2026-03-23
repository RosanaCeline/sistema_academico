const express = require('express');
const router = express.Router();

const EnrollmentController = require('../controllers/enrollmentController');
const validate = require('../middlewares/validate');
const { enrollmentCreateSchema } = require('../validators/enrollmentValidator');

const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Enrollment
 *   description: Gerenciamento de matrículas
 */

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Criar matrícula
 *     tags: [Enrollment]
 *     description: |
 *       Realiza a matrícula de um aluno em uma disciplina.
 *       - Administrador pode matricular qualquer aluno
 *       - Estudante só pode se matricular
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject_id
 *             properties:
 *               subject_id:
 *                 type: integer
 *                 example: 1
 *               student_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Matrícula criada com sucesso
 *       400:
 *         description: Erro na requisição
 *       403:
 *         description: Acesso negado
 */
router.post('/', auth, role(['ADMIN', 'STUDENT']), validate(enrollmentCreateSchema), EnrollmentController.enroll);

/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Listar matrículas
 *     tags: [Enrollment]
 *     description: |
 *       Retorna todas as matrículas:
 *       - Administrador vê todas
 *       - Estudante vê apenas as suas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de matrículas retornada com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get('/', auth, role(['ADMIN', 'STUDENT']), EnrollmentController.findAll);

/**
 * @swagger
 * /enrollments/subject/{subject_id}:
 *   get:
 *     summary: Listar matrículas por disciplina
 *     tags: [Enrollment]
 *     description: |
 *       Retorna todas as matrículas de uma disciplina.
 *       - Professor só pode ver suas disciplinas
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
 *         description: Lista retornada com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Disciplina não encontrada
 */
router.get('/subject/:subject_id', auth, role(['TEACHER', 'ADMIN']), EnrollmentController.findBySubject);

/**
 * @swagger
 * /enrollments/me/history:
 *   get:
 *     summary: Histórico escolar do aluno
 *     tags: [Enrollment]
 *     description: Retorna todas as matrículas do aluno com notas e frequência
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Histórico retornado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get('/me/history', auth, role(['STUDENT']), EnrollmentController.getMyHistory);

/**
 * @swagger
 * /enrollments/{id}/cancel:
 *   put:
 *     summary: Cancelar matrícula
 *     tags: [Enrollment]
 *     description: |
 *       Cancela uma matrícula ativa.
 *       - Não permite cancelar matrículas já finalizadas
 *       - Estudante só pode cancelar a própria matrícula
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula
 *     responses:
 *       200:
 *         description: Matrícula cancelada com sucesso
 *       400:
 *         description: Erro na operação
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Matrícula não encontrada
 */
router.put('/:id/cancel', auth, role(['ADMIN', 'STUDENT']), EnrollmentController.cancel);

/**
 * @swagger
 * /enrollments/{id}/finalize:
 *   put:
 *     summary: Finalizar matrícula
 *     tags: [Enrollment]
 *     description: |
 *       Finaliza a matrícula com base na média final e frequência:
 *       - Média >= 7 e frequência >= 75% → APROVADO
 *       - Caso contrário → REPROVADO
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula
 *     responses:
 *       200:
 *         description: Matrícula finalizada com sucesso
 *       400:
 *         description: Erro na operação
 *       404:
 *         description: Matrícula não encontrada
 */
router.put('/:id/finalize', auth, role(['ADMIN', 'TEACHER']), EnrollmentController.finalize);

module.exports = router;