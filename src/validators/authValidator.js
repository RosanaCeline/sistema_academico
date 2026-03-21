const yup = require('yup');

const registerValidator = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório'),

  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),

  password: yup
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),

  role: yup
    .string()
    .oneOf(['STUDENT', 'TEACHER', 'ADMIN'], 'Role inválida')
    .required('Role é obrigatória'),

  // Atributos do Professor
  specialty: yup
    .string()
    .when('role', {
      is: 'TEACHER',
      then: schema => schema.required('Especialidade é obrigatória para professor'),
      otherwise: schema => schema.notRequired()
    }),

  hire_date: yup
    .date()
    .typeError('Data de contratação inválida')
    .when('role', {
      is: 'TEACHER',
      then: schema => schema.required('Data de contratação é obrigatória para professor'),
      otherwise: schema => schema.notRequired()
    }),

  // Atributos do Estudante
  registration: yup
    .number()
    .typeError('Matrícula deve ser um número')
    .integer('Matrícula deve ser um número inteiro')
    .when('role', {
      is: 'STUDENT',
      then: schema => schema.required('Matrícula é obrigatória para estudante'),
      otherwise: schema => schema.notRequired()
    }),

  course_id: yup
    .number()
    .typeError('Curso deve ser um número')
    .integer('Curso deve ser um número inteiro')
    .when('role', {
      is: 'STUDENT',
      then: schema => schema.required('Curso é obrigatório para estudante'),
      otherwise: schema => schema.notRequired()
    }),

  // opcional
  semester: yup
    .number()
    .typeError('Semestre deve ser um número')
    .integer('Semestre deve ser um número inteiro')
    .positive('Semestre deve ser positivo')
    .notRequired()
});



const loginValidator = yup.object().shape({
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),

  password: yup
    .string()
    .required('Senha é obrigatória')
});

module.exports = {
  registerValidator,
  loginValidator
};