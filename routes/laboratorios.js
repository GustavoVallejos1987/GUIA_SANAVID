const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los laboratorios, con filtro opcional por localidad
router.get('/', async (req, res) => {
  const { localidad } = req.query;

  try {
    let query = `
      SELECT id, nombre, localidad, direccion,
             telefono, email, horario
      FROM laboratorios
    `;
    let values = [];

    if (localidad) {
      query += ' WHERE LOWER(localidad) LIKE $1';
      values.push(`%${localidad.toLowerCase()}%`);
    }

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener laboratorios:', error);
    res.status(500).json({ error: 'Error al obtener laboratorios' });
  }
});

module.exports = router;
