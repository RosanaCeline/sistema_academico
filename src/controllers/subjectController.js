const SubjectService = require('../services/subjectService');

class SubjectController {

    async create(req, res) {
        try {
            const subject = await SubjectService.create(req.body);
            return res.status(201).json(subject);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async findAll(req, res) {
        const subjects = await SubjectService.findAll();
        return res.json(subjects);
    }

    async findById(req, res) {
        try {
            const subject = await SubjectService.findById(req.params.id);
            return res.json(subject);
        } catch (err) {
            return res.status(404).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const subject = await SubjectService.update(req.params.id, req.body);
            return res.json(subject);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            await SubjectService.delete(req.params.id);
            return res.json({ message: 'Disciplina removida' });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
}

module.exports = new SubjectController();