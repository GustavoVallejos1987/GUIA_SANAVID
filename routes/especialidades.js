const express = require('express');
const router = express.Router();
const db = require('../models');

// Ruta para obtener todas las especialidades desde la tabla 'especialidades'
router.get('/', async (req, res) => {
  try {
    const result = await db.sequelize.query(`
      SELECT id, nombre AS especialidad
      FROM especialidades
      ORDER BY nombre ASC
    `);
    res.json(result[0]); // devolvemos el array de resultados
  } catch (error) {
    console.error('❌ Error al obtener especialidades:', error);
    res.status(500).json({ error: 'Error al obtener especialidades' });
  }
});

module.exports = router;


