const yup = require('yup');

const courseCreateSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(50, 'Nome muito longo')
        .required('Nome do curso é obrigatório'),

    description: yup
        .string()
        .trim()
        .max(255, 'Descrição muito longa')
        .nullable(),

    workload: yup
        .number()
        .typeError('Carga horária deve ser um número')
        .integer('Carga horária deve ser inteira')
        .min(1, 'Carga horária deve ser maior que 0')
        .required('Carga horária é obrigatória')
});

const courseUpdateSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(50, 'Nome muito longo'),

    description: yup
        .string()
        .trim()
        .max(255, 'Descrição muito longa')
        .nullable(),

    workload: yup
        .number()
        .typeError('Carga horária deve ser um número')
        .integer('Carga horária deve ser inteira')
        .min(1, 'Carga horária deve ser maior que 0')
});

module.exports = {
    courseCreateSchema,
    courseUpdateSchema
};