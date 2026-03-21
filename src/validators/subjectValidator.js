const yup = require('yup');

const subjectSchema = yup.object({
  name: yup
    .string()
    .required('Nome da disciplina é obrigatório'),

  workload: yup
    .number()
    .typeError('Carga horária deve ser um número'),

  vacancies: yup
    .number()
    .typeError('Vagas deve ser um número')
    .required('Quantidade de vagas é obrigatória')
    .min(1, 'Deve ter pelo menos 1 vaga'),

  course_id: yup
    .number()
    .typeError('course_id deve ser um número')
    .required('Curso é obrigatório'),

  teacher_id: yup
    .number()
    .typeError('teacher_id deve ser um número')
    .required('Professor é obrigatório')
});

module.exports = { subjectSchema };