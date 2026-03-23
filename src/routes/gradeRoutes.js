const express = require('express');
const router = express.Router();

const GradeController = require('../controllers/gradeController');
const validate = require('../middlewares/validate');
const { gradeCreateSchema, gradeUpdateSchema } = require('../validators/gradeValidator');

const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: Gerenciamento de notas dos alunos
 */

/**
 * @swagger
 * /grades:
 *   post:
 *     summary: Lançar nota (AV1 ou AV2)
 *     tags: [Grades]
 *     description: Professor lança uma nota para um aluno. A média final é calculada automaticamente.
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
 *               - type
 *               - value
 *             properties:
 *               enrollment_id:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum: [AV1, AV2]
 *                 example: AV1
 *               value:
 *                 type: number
 *                 example: 8.5
 *     responses:
 *       201:
 *         description: Nota criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 */
router.post('/', auth, role(['TEACHER']), validate(gradeCreateSchema), GradeController.create);

/**
 * @swagger
 * /grades/enrollment/{enrollment_id}:
 *   get:
 *     summary: Listar notas de um aluno por matrícula
 *     tags: [Grades]
 *     description: |
 *       Retorna todas as notas de uma matrícula específica.
 *       - Estudante só pode ver as próprias notas
 *       - Professor apenas de disciplinas que leciona
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
 *         description: Lista de notas retornada com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Matrícula não encontrada
 */
router.get('/enrollment/:enrollment_id', auth, role(['TEACHER', 'ADMIN', 'STUDENT']), GradeController.findByEnrollment);

/**
 * @swagger
 * /grades/subject/{subject_id}:
 *   get:
 *     summary: Listar notas de todos os alunos de uma disciplina
 *     tags: [Grades]
 *     description: |
 *       Retorna todas as notas vinculadas a uma disciplina.
 *       - Professor apenas de disciplinas que leciona
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
 *         description: Lista de notas retornada com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Disciplina não encontrada
 */
router.get('/subject/:subject_id', auth, role(['TEACHER', 'ADMIN']), GradeController.findBySubject);

/**
 * @swagger
 * /grades/{id}:
 *   put:
 *     summary: Atualizar nota
 *     tags: [Grades]
 *     description: |
 *       Permite ao professor atualizar o valor de uma nota.
 *       - Não é permitido alterar a média final
 *       - Não é permitido alterar notas de matrículas concluídas, reprovadas ou canceladas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da nota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 example: 9.0
 *     responses:
 *       200:
 *         description: Nota atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Nota não encontrada
 */
router.put('/:id', auth, role(['TEACHER']), validate(gradeUpdateSchema), GradeController.update);

/**
 * @swagger
 * /grades/{id}:
 *   delete:
 *     summary: Deletar nota
 *     tags: [Grades]
 *     description: |
 *       Permite ao professor remover uma nota.
 *       - Não é permitido remover a média final
 *       - Não é permitido remover notas de matrículas concluídas ou reprovadas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da nota
 *     responses:
 *       200:
 *         description: Nota removida com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Nota não encontrada
 */
router.delete('/:id', auth, role(['TEACHER']), GradeController.delete);

module.exports = router;