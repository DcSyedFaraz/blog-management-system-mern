// Middleware factory: wraps a Joi schema into an Express middleware.
// abortEarly:false collects all validation failures in one pass so the
// client gets every error at once instead of one per request.
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ message: 'Validation error', errors });
  }
  next();
};

export default validate;
