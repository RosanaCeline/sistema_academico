const router = require('express').Router();
const CourseController = require('../controllers/courseController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Gerenciamento de cursos
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Criar curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN pode criar cursos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, workload]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Engenharia da Computação
 *               description:
 *                 type: string
 *                 example: Curso focado em computação
 *               workload:
 *                 type: integer
 *                 example: 3000
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post('/', auth, role(['ADMIN']), CourseController.create);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Listar cursos
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos
 */
router.get('/', auth, CourseController.findAll);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Buscar curso por ID
 *     tags: [Courses]
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
 *         description: Curso encontrado
 *       404:
 *         description: Curso não encontrado
 */
router.get('/:id', auth, CourseController.findById);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Atualizar curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN pode atualizar cursos
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
 *                 example: Analise e Desenvolvimento de Sistemas
 *               description:
 *                 type: string
 *                 example: Curso tecnologo focado em desenvolvimento de sistemas
 *               workload:
 *                 type: integer
 *                 example: 1600
 *     responses:
 *       200:
 *         description: Curso atualizado
 */
router.put('/:id', auth, role(['ADMIN']), CourseController.update);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Deletar curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN pode deletar cursos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Curso deletado
 */
router.delete('/:id', auth, role(['ADMIN']), CourseController.delete);

module.exports = router;