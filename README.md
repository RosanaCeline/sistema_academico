# Sistema Acadêmico - Backend

## Descrição do Sistema

Este projeto consiste em uma API REST para gerenciamento de um sistema acadêmico (faculdade/escola), permitindo o controle de alunos, professores, disciplinas, matrículas, notas e frequência.

A aplicação foi desenvolvida seguindo arquitetura em camadas, aplicando autenticação JWT e gerenciamento de roles.

---

## Tecnologias Utilizadas

* JavaScript
* Node.js
* Express
* MySQL
* Sequelize (ORM)
* JWT (Autenticação)
* Yup (Validação)
* Swagger (Documentação da API)
* Postman (Testes de requisições)

---

## Arquitetura do Projeto

O sistema segue o padrão de arquitetura em camadas:

```
src/
 ├── config/        # Configurações de banco e swagger
 ├── controllers/   # Regras de entrada e resposta das requisições
 ├── middlewares/   # Autenticação, validações, roles 
 ├── models/        # Modelos do banco de dados
 ├── routes/        # Definição das rotas 
 ├── services/      # Regras de negócio
 └── validators/    # Schemas de validação
```

---

## Funcionalidades

### Alunos e Professores

* Cadastro de alunos
* Cadastro de professores

### Cursos e Disciplinas

* Criação de disciplinas
* Definição de limite de vagas

### Matrículas

* Matrícula em disciplinas
* Cancelamento de matrícula
* Finalização (aprovado/reprovado)

### Notas e Frequência

* Lançamento de notas (AV1, AV2)
* Cálculo automático da média final
* Registro de frequência

### Histórico Escolar

* Visualização de disciplinas cursadas
* Notas e frequência associadas

---

## Regras de Negócio

* Apenas **professores** podem lançar notas
* **Alunos** só podem visualizar seus próprios dados
* Cada disciplina possui **limite de vagas**
* Não é permitido:

  * Matricular aluno duplicado na mesma disciplina
  * Alterar notas após finalização
  * Cancelar matrículas concluídas ou reprovadas

---

## Autenticação e Autorização

* Autenticação via **JWT**
* Controle de acesso por perfis (**roles**):

  * `ADMIN`
  * `TEACHER`
  * `STUDENT`

---

## Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/RosanaCeline/sistema_academico
cd sistema-academico
```

---

### 2. Instale as dependências

```bash
npm install
```

---

### 3. Configure o arquivo `.env`

Exemplo:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_academico

JWT_SECRET=sua_chave_secreta
```

---

### 4️. Criar o banco de dados
```bash
mysql -u root -p -e "CREATE DATABASE sistema_academico;"
```

---

### 5. Execute o projeto

```bash
npm run dev
```

---

## Servidor

* URL base:

```
http://localhost:3000
```

## Documentação

A documentação completa da API está disponível via **Swagger**:

```
http://localhost:3000/docs
```

---

## Collection Postman

Uma collection do Postman está disponível no repositório contendo:

* Todas as rotas da API
* Exemplos de requisições
* Testes de autenticação

```
sistema_academico_collection.json
```

É possível executar a collection através do Postman em **Import → selecionar o arquivo**.
