const CourseService = require('../services/courseService');

class CourseController {

    async create(req, res) {
        try {
            const course = await CourseService.create(req.body);
            return res.status(201).json(course);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async findAll(req, res) {
        const courses = await CourseService.findAll();
        return res.json(courses);
    }

    async findById(req, res) {
        try {
            const course = await CourseService.findById(req.params.id);
            return res.json(course);
        } catch (err) {
            return res.status(404).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const course = await CourseService.update(req.params.id, req.body);
            return res.json(course);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            await CourseService.delete(req.params.id);
            return res.json({ message: 'Curso removido' });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
}

module.exports = new CourseController();