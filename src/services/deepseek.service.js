const OpenAI = require('openai');

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

async function preguntar(texto, system) {
  const msg = await client.chat.completions.create({
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content: system ?? 'Eres un asistente útil. Responde en español.',
      },
      { role: 'user', content: texto },
    ],
  });
  const respuesta = msg.choices?.[0]?.message?.content ?? '';
  return { respuesta, uso: msg.usage };
}

module.exports = { preguntar };
