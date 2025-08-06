const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los centros de diagnóstico, con filtro opcional por especialidad o localidad
router.get('/', async (req, res) => {
  const { especialidad, localidad } = req.query;

  try {
    let query = `
      SELECT id, nombre, especialidad, direccion,
             telefono, email, horario, localidad
      FROM diagnosticos
    `;
    let conditions = [];
    let values = [];

    if (especialidad) {
      conditions.push(`LOWER(especialidad) LIKE $${values.length + 1}`);
      values.push(`%${especialidad.toLowerCase()}%`);
    }

    if (localidad) {
      conditions.push(`LOWER(localidad) LIKE $${values.length + 1}`);
      values.push(`%${localidad.toLowerCase()}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener centros de diagnóstico:', error);
    res.status(500).json({ error: 'Error al obtener centros de diagnóstico' });
  }
});

module.exports = router;

