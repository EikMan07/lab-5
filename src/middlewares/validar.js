const validar = (schema) => (req, res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) {
    return res.status(400).json({ errores: r.error.issues });
  }
  req.body = r.data;
  next();
};

module.exports = validar;

