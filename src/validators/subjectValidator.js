const yup = require('yup');

const subjectCreateSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(50, 'Nome muito longo')
        .required('Nome da disciplina é obrigatório'),

    workload: yup
        .number()
        .typeError('Carga horária deve ser um número')
        .integer('Carga horária deve ser inteira')
        .min(1, 'Carga horária deve ser maior que 0')
        .nullable(),

    vacancies: yup
        .number()
        .typeError('Número de vagas deve ser um número')
        .integer('Número de vagas deve ser inteiro')
        .min(1, 'Deve haver pelo menos 1 vaga')
        .required('Número de vagas é obrigatório'),

    course_id: yup
        .number()
        .typeError('ID do curso deve ser um número')
        .integer('ID do curso deve ser inteiro')
        .required('Curso é obrigatório'),

    teacher_id: yup
        .number()
        .typeError('ID do professor deve ser um número')
        .integer('ID do professor deve ser inteiro')
        .nullable()
});


const subjectUpdateSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome muito longo'),

    workload: yup
        .number()
        .typeError('Carga horária deve ser um número')
        .integer('Carga horária deve ser inteira')
        .min(1, 'Carga horária deve ser maior que 0')
        .nullable(),

    vacancies: yup
        .number()
        .typeError('Número de vagas deve ser um número')
        .integer('Número de vagas deve ser inteiro')
        .min(1, 'Deve haver pelo menos 1 vaga'),

    course_id: yup
        .number()
        .typeError('ID do curso deve ser um número')
        .integer('ID do curso deve ser inteiro'),

    teacher_id: yup
        .number()
        .typeError('ID do professor deve ser um número')
        .integer('ID do professor deve ser inteiro')
        .nullable()
});

module.exports = {
    subjectCreateSchema,
    subjectUpdateSchema
};