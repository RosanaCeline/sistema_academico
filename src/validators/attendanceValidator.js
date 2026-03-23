const yup = require('yup');

const attendanceCreateSchema = yup.object().shape({
    enrollment_id: yup
        .number()
        .typeError('ID da matrícula deve ser um número')
        .integer('ID da matrícula deve ser inteiro')
        .positive('ID da matrícula deve ser positivo')
        .required('ID da matrícula é obrigatório'),

    percentage: yup
        .number()
        .typeError('Frequência deve ser um número')
        .min(0, 'Frequência mínima é 0%')
        .max(100, 'Frequência máxima é 100%')
        .required('Frequência é obrigatória')
});

const attendanceUpdateSchema = yup.object().shape({
    percentage: yup
        .number()
        .typeError('Frequência deve ser um número')
        .min(0, 'Frequência mínima é 0%')
        .max(100, 'Frequência máxima é 100%')
        .required('Frequência é obrigatória')
});

module.exports = {
    attendanceCreateSchema,
    attendanceUpdateSchema
};