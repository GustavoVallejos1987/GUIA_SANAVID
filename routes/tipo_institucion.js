const express = require('express');
const router = express.Router();
const db = require('../models'); // Asegurate de que este sea tu Sequelize setup

// Obtener todos los tipos de institución
router.get('/', async (req, res) => {
  try {
    const result = await db.sequelize.query(
      `SELECT id, nombre FROM tipo_institucion ORDER BY nombre ASC`
    );
    res.json(result[0]); // Sequelize devuelve un array con [resultados, metadata]
  } catch (error) {
    console.error('Error al obtener tipo de institución:', error);
    res.status(500).json({ error: 'Error al obtener tipo de institución' });
  }
});

module.exports = router;

