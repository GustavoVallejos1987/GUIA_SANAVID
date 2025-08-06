const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los médicos, con filtro opcional por especialidad, ciudad y departamento
router.get('/', async (req, res) => {
  const { especialidad, ciudad, departamento } = req.query;

  try {
    let query = `
      SELECT m.id, m.nombre, m.especialidad, m.telefono,
             s.nombre AS sanatorio, s.ciudad, s.departamento, s.direccion
      FROM medicos m
      JOIN sanatorios s ON m.sanatorio_id = s.id
      WHERE 1=1
    `;
    let values = [];
    let conditions = [];

    if (especialidad) {
      conditions.push(`LOWER(m.especialidad) LIKE $${values.length + 1}`);
      values.push(`%${especialidad.toLowerCase()}%`);
    }

    if (ciudad) {
      conditions.push(`LOWER(s.ciudad) LIKE $${values.length + 1}`);
      values.push(`%${ciudad.toLowerCase()}%`);
    }

    if (departamento) {
      conditions.push(`LOWER(s.departamento) LIKE $${values.length + 1}`);
      values.push(`%${departamento.toLowerCase()}%`);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener médicos:', error);
    res.status(500).json({ error: 'Error al obtener médicos' });
  }
});

module.exports = router;


