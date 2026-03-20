// Server para iniciar app
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
require('./models');

const app = require('./app');

app.use(cors());
app.use(express.json());

// Rota base de teste
app.get("/", (req, res) => {
  res.send("API do Sistema Acadêmico rodando!");
});

// Teste de conexão com o banco de dados
sequelize
  .sync({ alter: true })
  .then(() => console.log("Banco conectado com sucesso"))
  .catch((err) => console.error("Erro ao conectar no banco:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/docs`);
});