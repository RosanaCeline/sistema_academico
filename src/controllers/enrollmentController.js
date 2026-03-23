const EnrollmentService = require('../services/enrollmentService');

class EnrollmentController {

    async enroll(req, res) {
        try {
            const { subject_id, student_id } = req.body;

            const enrollment = await EnrollmentService.enroll(
                req.user,
                subject_id,
                student_id
            );

            return res.status(201).json(enrollment);

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async findAll(req, res) {
        try {
            const enrollments = await EnrollmentService.findAll(req.user);
            return res.json(enrollments);

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async findBySubject(req, res) {
        try {
            const { subject_id } = req.params;

            const enrollments = await EnrollmentService.findBySubject(
                subject_id,
                req.user
            );

            return res.json(enrollments);

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async getMyHistory(req, res) {
        try {
            const history = await EnrollmentService.getMyHistory(req.user);
            return res.json(history);

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async cancel(req, res) {
        try {
            const { id } = req.params;

            const enrollment = await EnrollmentService.cancel(
                id,
                req.user
            );

            return res.json(enrollment);

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async finalize(req, res) {
        try {
            const { id } = req.params;

            const result = await EnrollmentService.finalize(id);

            return res.json(result);

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
}

module.exports = new EnrollmentController();