module.exports = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        next();
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(err.errors);
        }

        return res.status(400).json({
            message: 'Validation error',
            errors: err.errors || [err.message]
        });
    }
};