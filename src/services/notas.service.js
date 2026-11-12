const { AppError } = require('../utils/errors');

let notas = [];
let nextId = 1;

const listar = () => notas;

function buscar(id) {
  const nota = notas.find((n) => n.id === id);
  if (!nota) {
    throw new AppError(404, 'Nota no encontrada');
  }
  return nota;
}

function crear({ titulo, contenido }) {
  const nota = { id: nextId++, titulo, contenido };
  notas.push(nota);
  return nota;
}

function eliminar(id) {
  buscar(id);
  notas = notas.filter((n) => n.id !== id);
}

module.exports = { listar, buscar, crear, eliminar };
