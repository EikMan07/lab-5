const { AppError } = require('../utils/errors');
const OpenAI = require('openai');

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err instanceof OpenAI.APIError) {
    console.error('DeepSeek API:', err.status, err.message);
    const status = err.status === 429 ? 429 : (err.status === 529 || err.status === 503) ? 503 : 502;
    return res.status(status).json({ error: 'IA_NO_DISPONIBLE' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Error interno' });
}

module.exports = errorHandler;

