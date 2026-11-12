# Laboratorio #5: API REST con Express, Swagger y DeepSeek API

API REST de gestión de notas desarrollada con **Node.js** (CommonJS) y **Express 5**, con validación de esquemas mediante **Zod**, documentación interactiva **OpenAPI 3 (Swagger UI)** e integración con Inteligencia Artificial (**DeepSeek API** a través del SDK oficial `openai`).

---

## Integrantes y Roles

- **Eiker Manuel Abarca Murillo** — Desarrollo integral cubriendo ambos roles del laboratorio:
  - **Rol A (API REST y Documentación Base):** CRUD de notas en memoria (`src/services/notas.service.js`), validación con Zod (`src/middlewares/validar.js`), rutas de notas (`src/routes/notas.routes.js`), configuración de Express 5 (`src/app.js`, `src/index.js`) y configuración de Swagger (`src/config/swagger.js`).
  - **Rol B (Integración con IA y Manejo de Errores):** Servicio cliente de DeepSeek (`src/services/deepseek.service.js`), endpoints con IA (`POST /api/ia/preguntar` y `POST /api/notas/:id/resumen`), manejo centralizado de errores (`src/utils/errors.js`, `src/middlewares/errorHandler.js`) y documentación `@openapi`.

---

## Requisitos Previos e Instalación

- **Node.js** v20 o superior (verificado en `v24.19.0`)
- **npm**
- Una API key válida de [DeepSeek Platform](https://platform.deepseek.com/)

### Pasos de instalación y ejecución

1. **Clonar el repositorio y entrar al directorio:**
   ```bash
   git clone https://github.com/EikMan07/lab-5.git
   cd lab-5
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia `.env.example` a `.env` y coloca tu clave real en `DEEPSEEK_API_KEY`:
   ```bash
   cp .env.example .env
   ```

4. **Ejecutar el servidor:**
   - Modo desarrollo (recarga automática con `nodemon`):
     ```bash
     npm run dev
     ```
   - Modo producción:
     ```bash
     npm start
     ```

5. **Abrir la documentación interactiva:**
   Visita [http://localhost:3000/api-docs](http://localhost:3000/api-docs) en tu navegador.

---

## Variables de Entorno (`.env.example`)

| Variable | Valor por defecto / Ejemplo | Descripción |
| :--- | :--- | :--- |
| `DEEPSEEK_API_KEY` | *(vacío en `.env.example`)* | Clave secreta de autenticación para la API de DeepSeek. Se define únicamente en `.env` (ignorado por Git). |
| `DEEPSEEK_MODEL` | `deepseek-chat` | Identificador del modelo de DeepSeek utilizado en `client.chat.completions.create`. |
| `PORT` | `3000` | Puerto HTTP en el que escucha el servidor Express. |

---

## Endpoints de la API (7 Endpoints)

| Método | Endpoint | Descripción | Usa IA | Códigos de Respuesta |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api-docs` | Interfaz gráfica interactiva de Swagger UI | No | `200` |
| `GET` | `/api/notas` | Lista todas las notas almacenadas en memoria | No | `200` |
| `POST` | `/api/notas` | Crea una nueva nota validando `titulo` y `contenido` con Zod | No | `201`, `400` |
| `GET` | `/api/notas/:id` | Obtiene una nota específica por su ID numérico | No | `200`, `404` |
| `DELETE` | `/api/notas/:id` | Elimina una nota existente por su ID | No | `204`, `404` |
| `POST` | `/api/ia/preguntar` | Envía una pregunta libre (`3`–`2000` caracteres) a DeepSeek | Sí | `200`, `400`, `429`, `502`, `503` |
| `POST` | `/api/notas/:id/resumen` | Busca la nota por ID y resume su contenido en 3 viñetas con DeepSeek | Sí | `200`, `404`, `429`, `502`, `503` |

---

## Experimento con el Parámetro `system` (Paso 9)

Se probó `deepseek.preguntar(nota.contenido, system)` sobre una misma nota de entrada (*"Express 5 simplifica el manejo de errores asíncronos al capturar promesas rechazadas en rutas sin try/catch manual. Además, la validación de entradas con Zod garantiza esquemas tipados antes de ejecutar la lógica de negocio. Documentar los endpoints con OpenAPI 3 mediante Swagger facilita probar la API desde el navegador."*) variando únicamente la instrucción `system`:

| Variante | Valor de `system` | Salida real obtenida de DeepSeek |
| :--- | :--- | :--- |
| **Por defecto (endpoint)** | `"Resume el texto en 3 viñetas breves, en español."` | - Express 5 captura automáticamente las promesas rechazadas en las rutas, eliminando la necesidad de try/catch manual en el manejo de errores asíncronos.<br>- La validación de entradas con Zod asegura esquemas tipados antes de ejecutar la lógica de negocio.<br>- Documentar los endpoints con OpenAPI 3 vía Swagger facilita probar la API directamente desde el navegador. |
| **Variación 1** | `"Resume el texto en una sola frase concisa, en español."` | Express 5 captura promesas rechazadas sin try/catch, Zod valida entradas con esquemas tipados y OpenAPI 3 con Swagger permite probar la API desde el navegador. |
| **Variación 2** | `"Extrae únicamente las palabras clave separadas por comas."` | `Express 5, manejo de errores asíncronos, promesas rechazadas, rutas, try/catch, validación de entradas, Zod, esquemas tipados, lógica de negocio, documentar endpoints, OpenAPI 3, Swagger, probar la API, navegador` |
| **Variación 3** | `"Translate the text into English in 3 short bullet points."` | - Express 5 simplifies async error handling by catching rejected promises in routes without manual try/catch.<br>- Input validation with Zod ensures typed schemas before executing business logic.<br>- Documenting endpoints with OpenAPI 3 via Swagger makes it easy to test the API from the browser. |

---

## Resultados de la Batería de Pruebas Cruzadas (Paso 12) y Capturas (`docs/`)

Todos los casos fueron verificados mediante ejecución automatizada contra la API y Swagger UI. La carpeta [`docs/`](./docs) está preparada para almacenar las capturas de Swagger UI correspondientes a los casos marcados con **★**:

| # | Caso de Prueba | Resultado Esperado | Resultado Obtenido | Captura en `docs/` |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `POST /api/notas` (crear 2 notas válidas) | `201 Created` con `id: 1` e `id: 2` | ✅ Aprobado (`201`, notas creadas con `id: 1` e `id: 2`) | — |
| 2 | `GET /api/notas` | `200 OK` con arreglo de 2 notas | ✅ Aprobado (`200`, longitud `2`) | — |
| 3 | `GET /api/notas/99` | `404 Not Found` `{ "error": "Nota no encontrada" }` | ✅ Aprobado (`404`, `{ error: 'Nota no encontrada' }`) | — |
| 4 | `POST /api/notas` con `{}` | `400 Bad Request` con detalles de Zod | ✅ Aprobado (`400`, `errores` con `2` issues) | — |
| 5 ★ | `POST /api/ia/preguntar` válido | `200 OK` con `{ respuesta, uso }` | ✅ Aprobado (`200`, `respuesta` y `uso` recibidos) | [Capturas Swagger IA](./docs/.gitkeep) (`docs/captura-ia-preguntar.png`) |
| 6 ★ | `POST /api/notas/1/resumen` | `200 OK` con `{ notaId: 1, resumen }` en 3 viñetas | ✅ Aprobado (`200`, `notaId: 1` y resumen en 3 viñetas) | [Capturas Swagger Resumen](./docs/.gitkeep) (`docs/captura-notas-resumen.png`) |
| 7 | `POST /api/notas/99/resumen` | `404 Not Found` sin llamar a DeepSeek | ✅ Aprobado (`404`, `0` llamadas adicionales a IA) | — |
| 8 | `POST /api/ia/preguntar` con `{ "pregunta": "a" }` | `400 Bad Request` sin llamar a DeepSeek | ✅ Aprobado (`400`, `errores: 1`, `0` llamadas adicionales a IA) | — |
| 9 | Error `OpenAI.APIError` (`401` simulado en memoria; también `429` y `529`/`503`) | Log interno + `502` `{ "error": "IA_NO_DISPONIBLE" }` (`429 -> 429`, `529/503 -> 503`) | ✅ Aprobado (`401 -> 502`, `429 -> 429`, `529 -> 503`, `503 -> 503` con `{ error: 'IA_NO_DISPONIBLE' }`) | — |
| 10 ★ | `DELETE /api/notas/2` y luego `GET /api/notas/2` | `204 No Content` y después `404 Not Found` | ✅ Aprobado (`204` seguido de `404` `{ error: 'Nota no encontrada' }`) | [Capturas Swagger UI](./docs/.gitkeep) (`docs/captura-swagger-ui.png`) |

> **Nota sobre capturas:** La carpeta `docs/` incluye `docs/.gitkeep` para versionar el directorio. Coloca allí tus capturas de pantalla de `http://localhost:3000/api-docs` (`captura-swagger-ui.png`, `captura-ia-preguntar.png`, `captura-notas-resumen.png`).

---

## Sección 6: Preguntas de Reflexión

### 1. ¿Por qué la API key no puede estar en el frontend? Describan cómo la podría obtener un usuario cualquiera.
La API key de DeepSeek es una credencial privada asociada directamente a la facturación y cuota de nuestra cuenta. Todo el código que se ejecuta en el frontend (HTML, CSS y JavaScript) se descarga y corre en el navegador del usuario final, por lo que **cualquier secreto embebido en el cliente deja de ser secreto**. Un usuario cualquiera podría obtener la clave en segundos usando las herramientas de desarrollo del navegador (**Chrome DevTools**):
- **Pestaña *Network*:** Al disparar la petición hacia la API externa, basta inspeccionar los encabezados HTTP de la solicitud (`Request Headers`) para leer en texto claro `Authorization: Bearer sk-...` o `x-api-key`.
- **Pestaña *Sources* / *Application*:** Buscando `sk-` o `DEEPSEEK` dentro del bundle JavaScript empaquetado, en el código fuente descargado o en `localStorage`/`sessionStorage`.

Una vez extraída, cualquier tercero puede copiar la clave y usarla en sus propios scripts hasta agotar el saldo o provocar el bloqueo de la cuenta. Por eso la clave permanece exclusivamente en el archivo `.env` del servidor backend (protegido por `.gitignore`).

---

### 2. ¿Qué responde su API cuando el proveedor de IA devuelve `401`? ¿Por qué no se reenvía ese mismo `401` al cliente?
Cuando DeepSeek responde con un error `OpenAI.APIError` de estado `401`, nuestro middleware [`errorHandler.js`](./src/middlewares/errorHandler.js) registra el detalle técnico en la consola del servidor (`DeepSeek API: 401 ...`) y responde al cliente con estado HTTP **`502 Bad Gateway`** y el cuerpo JSON:
```json
{ "error": "IA_NO_DISPONIBLE" }
```
**¿Por qué no reenviar `401` al cliente?**
1. **Semántica HTTP correcta:** Un código `401 Unauthorized` indica que *el cliente que llamó a nuestra API* falló al autenticarse ante nosotros. Sin embargo, el cliente envió una petición válida a nuestro servidor; el fallo ocurrió entre nuestro backend y un servicio externo (*upstream*). Para ese escenario de puerta de enlace fallida frente a un proveedor externo, el estándar HTTP define `502 Bad Gateway` (y `429` o `503` para límites de tasa o sobrecarga).
2. **Seguridad y encapsulamiento:** Reenviar el `401` y el mensaje crudo del proveedor filtraría detalles internos sobre nuestra arquitectura, qué proveedor de LLM utilizamos o que nuestra clave de servidor expiró o es inválida.

---

### 3. ¿Qué diferencia hay entre el parámetro `system` y el contenido de `messages` (`user`)? Den un ejemplo de su prueba.
Dentro del arreglo `messages` de `chat.completions.create`:
- **El rol `system`** establece las **reglas globales, rol, tono, idioma y formato de salida** que el modelo debe obedecer durante toda la interacción. Actúa como el contrato de comportamiento del asistente.
- **El rol `user`** contiene los **datos de entrada o la solicitud concreta** que el modelo debe procesar bajo las reglas definidas por `system`.

**Ejemplo real de nuestra prueba (`POST /api/notas/1/resumen`):**
- **`system`:** `"Resume el texto en 3 viñetas breves, en español."`
- **`user` (`nota.contenido`):** `"Express 5 simplifica el manejo de errores asíncronos al capturar promesas rechazadas en rutas sin try/catch manual. Además, la validación de entradas con Zod garantiza esquemas tipados antes de ejecutar la lógica de negocio. Documentar los endpoints con OpenAPI 3 mediante Swagger facilita probar la API desde el navegador."`
- **Resultado:** El modelo no respondió libremente ni extendió el tema, sino que sintetizó exactamente el contenido del usuario en 3 viñetas breves en español. Al cambiar únicamente `system` a `"Extrae únicamente las palabras clave separadas por comas."` con el mismo `user`, devolvió una lista separada por comas.

---

### 4. Anoten los `input_tokens` y `output_tokens` de dos de sus llamadas. ¿Qué parámetro les permite limitar el costo?
Valores reales medidos durante la Fase 3 (`msg.usage` devuelto por DeepSeek):

| Endpoint | Entrada enviada | `prompt_tokens` (`input_tokens`) | `completion_tokens` (`output_tokens`) | `total_tokens` |
| :--- | :--- | :---: | :---: | :---: |
| `POST /api/ia/preguntar` | `"¿Qué es una API REST en una oración?"` | `28` | `45` | `73` |
| `POST /api/notas/1/resumen` | Nota de arquitectura REST/Express 5 + prompt `system` | `106` | `94` | `200` |

**¿Qué parámetro permite limitar el costo?**
- **`max_tokens` (`1024`)** en `client.chat.completions.create(...)` dentro de [`src/services/deepseek.service.js`](./src/services/deepseek.service.js): establece un techo estricto sobre la cantidad máxima de tokens que el modelo puede generar en la respuesta (`output_tokens`), evitando respuestas descontroladas y acotando el costo por petición.
- De forma complementaria, las reglas de longitud en **Zod** (`pregunta` con `.max(2000)` en [`src/routes/ia.routes.js`](./src/routes/ia.routes.js) y `contenido` con `.max(5000)` en [`src/routes/notas.routes.js`](./src/routes/notas.routes.js)) acotan los tokens de entrada (`input_tokens`).

---

### 5. ¿Qué pasaría si no validaran el body antes de llamar a la IA? Mencionen al menos dos consecuencias.
Si elimináramos el middleware `validar(schema)` con Zod antes de invocar `deepseek.preguntar()`:
1. **Consumo innecesario de saldo y ataques *Denial of Wallet*:** Un cliente podría enviar cadenas vacías, tipos incorrectos o textos de cientos de miles de caracteres (`req.body.pregunta`), generando llamadas reales a DeepSeek con altísimo consumo de `input_tokens` y gasto económico inmediato.
2. **Errores en cascada y mayor latencia:** Enviar `undefined`, `null` o un objeto mal formado al SDK de OpenAI provocaría que la petición viaje hasta los servidores de DeepSeek solo para ser rechazada con un error `400` del proveedor externo (que nuestro backend transformaría en `502 IA_NO_DISPONIBLE`), desperdiciando ancho de banda y tiempo de respuesta en lugar de responder instantáneamente un `400 Bad Request` local.
3. **Agotamiento prematuro de cuota (`429 Rate Limit`):** Peticiones inválidas o automatizadas llegarían directo a la API externa consumiendo nuestro límite de peticiones por minuto y afectando a usuarios legítimos.

---

### 6. ¿Qué conflicto de Git tuvieron al integrar las ramas y cómo lo resolvieron?
Al trabajar en paralelo la arquitectura base y las dos funcionalidades principales —la rama del CRUD de notas (`feature/notas`, Rol A) y la rama de integración con IA (`feature/ia`, Rol B)—, el punto de convergencia y conflicto natural en Git ocurre en el archivo compartido **[`src/routes/notas.routes.js`](./src/routes/notas.routes.js)**:
- En la rama de notas se implementan los 4 endpoints CRUD (`GET /`, `GET /:id`, `POST /`, `DELETE /:id`) y su exportación `module.exports = router;`.
- En la rama de IA se añade la importación de `deepseek.service` y el endpoint combinado `POST /:id/resumen`, que depende tanto de `notas.buscar(id)` (Rol A) como de `deepseek.preguntar(...)` (Rol B).

**Resolución:** Al integrar ambos cambios hacia la rama principal mediante Pull Request, se conservan las importaciones de ambos módulos al inicio del archivo (`notas.service` y `deepseek.service`), se mantienen intactas las rutas CRUD junto con sus bloques `@openapi` y se coloca `POST /:id/resumen` antes de `module.exports = router;`, asegurando que `notas.buscar(Number(req.params.id))` valide la existencia de la nota (`404`) antes de invocar a DeepSeek.
