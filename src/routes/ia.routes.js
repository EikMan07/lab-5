const { Router } = require('express');
const { z } = require('zod');
const validar = require('../middlewares/validar');
const deepseek = require('../services/deepseek.service');

const router = Router();

const preguntaSchema = z.object({
  pregunta: z.string().min(3).max(2000),
});

/**
 * @openapi
 * /api/ia/preguntar:
 *   post:
 *     summary: Envía una pregunta a DeepSeek
 *     tags: [IA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pregunta'
 *     responses:
 *       200:
 *         description: Respuesta del modelo
 *       400:
 *         description: Datos inválidos
 *       502:
 *         description: IA no disponible
 */
router.post('/preguntar', validar(preguntaSchema), async (req, res) => {
  const r = await deepseek.preguntar(req.body.pregunta);
  res.json(r);
});

module.exports = router;
