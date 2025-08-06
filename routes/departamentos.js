const express = require('express');
const router = express.Router();
const { Departamento } = require('../models');

router.get('/', async (req, res) => {
  try {
    const departamentos = await Departamento.findAll();
    res.json(departamentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener departamentos' });
  }
});

module.exports = router;
