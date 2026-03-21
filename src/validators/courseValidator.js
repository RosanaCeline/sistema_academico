const yup = require('yup');

const courseSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Nome do curso é obrigatório'),

  description: yup
    .string()
    .nullable(),

  workload: yup
    .number()
    .typeError('Carga horária deve ser um número')
    .required('Carga horária do curso é obrigatória')
    .integer('Carga horária deve ser um número inteiro')
    .positive('Carga horária deve ser maior que zero')
});

module.exports = { courseSchema };