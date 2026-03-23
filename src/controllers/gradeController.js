const GradeService = require('../services/gradeService');

class GradeController {

    async create(req, res) {
        try {
            const grade = await GradeService.create(req.body);

            return res.status(201).json({
                message: 'Nota cadastrada com sucesso',
                data: grade
            });

        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    }


    async findByEnrollment(req, res) {
        try {
            const { enrollment_id } = req.params;

            const grades = await GradeService.findByEnrollment(
                enrollment_id,
                req.user
            );

            return res.json(grades);

        } catch (err) {
            return res.status(403).json({
                error: err.message
            });
        }
    }


    async findBySubject(req, res) {
        try {
            const { subject_id } = req.params;

            const grades = await GradeService.findBySubject(
                subject_id,
                req.user
            );

            return res.json(grades);

        } catch (err) {
            return res.status(403).json({
                error: err.message
            });
        }
    }


    async update(req, res) {
        try {
            const { id } = req.params;

            const grade = await GradeService.update(id, req.body);

            return res.json({
                message: 'Nota atualizada com sucesso',
                data: grade
            });

        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    }


    async delete(req, res) {
        try {
            const { id } = req.params;

            await GradeService.delete(id);

            return res.json({
                message: 'Nota deletada com sucesso'
            });

        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    }
}

module.exports = new GradeController();