const router = require('express').Router();
const SubjectController = require('../controllers/subjectController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: Gerenciamento de disciplinas
 */

/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Criar disciplina
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN pode criar disciplinas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, vacancies, course_id, teacher_id]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Desenvolvimento Web
 *               workload:
 *                 type: integer
 *                 example: 40
 *               vacancies:
 *                 type: integer
 *                 example: 30
 *               course_id:
 *                 type: integer
 *                 example: 1
 *               teacher_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post('/', auth, role(['ADMIN']), SubjectController.create);

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Listar disciplinas
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de disciplinas
 */
router.get('/', auth, SubjectController.findAll);

/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Buscar disciplina por ID
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Disciplina encontrada
 *       404:
 *         description: Disciplina não encontrada
 */
router.get('/:id', auth, SubjectController.findById);

/**
 * @swagger
 * /subjects/{id}:
 *   put:
 *     summary: Atualizar disciplina
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN pode atualizar disciplinas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Design Web
 *               workload:
 *                 type: integer
 *                 example: 40
 *               vacancies:
 *                 type: integer
 *                 example: 30
 *               course_id:
 *                 type: integer
 *                 example: 1
 *               teacher_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Disciplina atualizada
 */
router.put('/:id', auth, role(['ADMIN']), SubjectController.update);

/**
 * @swagger
 * /subjects/{id}:
 *   delete:
 *     summary: Deletar disciplina
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN pode deletar disciplinas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Disciplina deletada
 */
router.delete('/:id', auth, role(['ADMIN']), SubjectController.delete);

module.exports = router;