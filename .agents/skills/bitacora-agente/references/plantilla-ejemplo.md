# Referencia y Ejemplo de Entrada en `bitacora_agente.md`

## Plantilla Markdown estándar

```markdown
## [Entrada #1]
**Indicación / Tarea:**
> [Texto exacto o resumen fiel de la solicitud del usuario]

### 1. Archivos Afectados
- `src/services/notas.service.js` (Modificado)
- `src/routes/notas.routes.js` (Modificado)

### 2. Resumen de Acciones Técnicas
- Se implementó la lógica CRUD de notas en `src/services/notas.service.js`.
- Se registraron los endpoints en `src/routes/notas.routes.js` con validación Zod y anotaciones Swagger.
- Verificación: `node --check` validado y respuesta `200` en `GET /api-docs/`.

### 3. Respuesta Completa del Agente
[Texto íntegro entregado al usuario...]

---
```
