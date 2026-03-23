const yup = require('yup');

const enrollmentCreateSchema = yup.object().shape({
    subject_id: yup
        .number()
        .typeError('ID da disciplina deve ser um número')
        .integer('ID da disciplina deve ser inteiro')
        .positive('ID da disciplina deve ser positivo')
        .required('ID da disciplina é obrigatório'),

    student_id: yup
        .number()
        .typeError('ID do estudante deve ser um número')
        .integer('ID do estudante deve ser inteiro')
        .positive('ID do estudante deve ser positivo')
        .notRequired()
});

module.exports = {
    enrollmentCreateSchema
};