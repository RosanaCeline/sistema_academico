const yup = require('yup');

const registerValidator = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    role: yup.string().oneOf(['STUDENT', 'TEACHER', 'ADMIN']).required(),

    specialty: yup.string().when('role', {
        is: 'TEACHER',
        then: schema => schema.required()
    }),

    hire_date: yup.date().when('role', {
        is: 'TEACHER',
        then: schema => schema.required()
    }),

    registration: yup.number().when('role', {
        is: 'STUDENT',
        then: schema => schema.required()
    }),

    course_id: yup.number().when('role', {
        is: 'STUDENT',
        then: schema => schema.required()
    })
});

const loginValidator = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
});

module.exports = {
    registerValidator,
    loginValidator
};