const yup = require('yup');

const gradeCreateSchema = yup.object().shape({
    enrollment_id: yup
        .number()
        .typeError('ID da matrícula deve ser um número')
        .integer('ID da matrícula deve ser inteiro')
        .required('Matrícula é obrigatória'),

    type: yup
        .string()
        .oneOf(['AV1', 'AV2'], 'Tipo deve ser AV1 ou AV2')
        .required('Tipo da nota é obrigatório'),

    value: yup
        .number()
        .typeError('Valor deve ser um número')
        .min(0, 'Nota mínima é 0')
        .max(10, 'Nota máxima é 10')
        .required('Valor da nota é obrigatório')
});


const gradeUpdateSchema = yup.object().shape({
    value: yup
        .number()
        .typeError('Valor deve ser um número')
        .min(0, 'Nota mínima é 0')
        .max(10, 'Nota máxima é 10'),
});


module.exports = {
    gradeCreateSchema,
    gradeUpdateSchema
};