module.exports = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        next();
    } catch (err) {
        console.log(err); 

        return res.status(400).json({
        message: 'Validation error',
        errors: err.errors || [err.message]
        });
    }
};