const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los sanatorios con filtro opcional por departamento
router.get('/', async (req, res) => {
  const { departamento } = req.query;

  try {
    let query = `
      SELECT id, nombre, localidad, departamento, direccion,
             telefono, email, horario
      FROM sanatorios
      WHERE 1=1
    `;
    let values = [];
    let conditions = [];

    if (departamento) {
      conditions.push(`LOWER(departamento) LIKE $${values.length + 1}`);
      values.push(`%${departamento.toLowerCase()}%`);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener sanatorios:', error);
    res.status(500).json({ error: 'Error al obtener sanatorios' });
  }
});

module.exports = router;



