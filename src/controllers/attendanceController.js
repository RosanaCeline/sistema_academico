const AttendanceService = require('../services/attendanceService');

class AttendanceController {

    async create(req, res) {
        try {
            const attendance = await AttendanceService.create(req.body, req.user);

            return res.status(201).json(attendance);

        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    }

    async findByEnrollment(req, res) {
        try {
            const { enrollment_id } = req.params;

            const attendance = await AttendanceService.findByEnrollment(
                enrollment_id,
                req.user
            );

            return res.json(attendance);

        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    }

    async findBySubject(req, res) {
        try {
            const { subject_id } = req.params;

            const attendances = await AttendanceService.findBySubject(
                subject_id,
                req.user
            );

            return res.json(attendances);

        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;

            const attendance = await AttendanceService.update(
                id,
                req.body,
                req.user
            );

            return res.json(attendance);

        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            await AttendanceService.delete(id, req.user);

            return res.status(204).send();

        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    }
}

module.exports = new AttendanceController();