// Classe app

const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const subjectRoutes = require('./routes/subjectRoutes');

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/docs-json', (req, res) => res.json(swaggerSpec));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// rotas
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'O Market System API funcionando!' });
});

module.exports = app;