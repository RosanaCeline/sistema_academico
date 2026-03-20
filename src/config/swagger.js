const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema Acadêmico API",
      version: "1.0.0",
      description: "API para gerenciamento acadêmico"
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor local"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
  },

  // onde o swagger vai ler as rotas
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;