const AuthService = require('../services/authService');

class AuthController {

    async register(req, res) {
        try {
            const user = await AuthService.register(req.body);

            return res.status(201).json({
                message: 'Usuário criado com sucesso',
                user
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const data = await AuthService.login(email, password);

            return res.json(data);
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();