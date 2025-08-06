const express = require('express');
const router = express.Router();
const { Localidad, Departamento } = require('../models');

// Ruta general para obtener TODAS las localidades con su departamento
router.get('/', async (req, res) => {
  try {
    const localidades = await Localidad.findAll({
      include: {
  model: Departamento,
  as: 'departamento',
  attributes: ['nombre']
}
    });
    res.json(localidades);
  } catch (error) {
    console.error('Error al obtener localidades:', error);
    res.status(500).json({ error: 'Error al obtener localidades' });
  }
});

// Ruta filtrada por ID de departamento
router.get('/:departamentoId', async (req, res) => {
  const { departamentoId } = req.params;
  try {
    const localidades = await Localidad.findAll({
      where: { departamento_id: departamentoId }
    });
    res.json(localidades);
  } catch (error) {
    console.error('Error al obtener localidades por departamento:', error);
    res.status(500).json({ error: 'Error al obtener localidades por departamento' });
  }
});

module.exports = router;


