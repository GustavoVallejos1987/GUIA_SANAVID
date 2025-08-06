const express = require('express');
const router = express.Router();

// IMPORTAR LOS MODELOS CORRECTAMENTE
const { Prestador, Localidad, Departamento } = require('../models');

// Obtener todos los prestadores con Localidad y Departamento
router.get('/', async (req, res) => {
  try {
    const prestadores = await Prestador.findAll({
      include: [
        {
          model: Localidad,
          as: 'localidad', // ✅ usar el alias correctamente
          attributes: ['nombre'],
          include: [
            {
              model: Departamento,
              as: 'departamento', // ✅ también aquí
              attributes: ['nombre']
            }
          ]
        },
        {
          model: Departamento,
          as: 'departamento', // Este es el departamento directo del prestador (si existe)
          attributes: ['nombre']
        },
        {
          model: Prestador,
          as: 'madre', // Institución madre si aplica
          attributes: ['nombre']
        }
      ]
    });
    res.json(prestadores);
  } catch (error) {
    console.error('Error al obtener prestadores:', error);
    res.status(500).json({ error: 'Error al obtener prestadores' });
  }
});


// Crear nuevo prestador
router.post('/', async (req, res) => {
  try {
    console.log("📥 BODY recibido:", req.body);
    const nuevo = await Prestador.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear prestador:', error);
    res.status(500).json({ error: 'Error al crear prestador' });
  }
});

// Obtener prestador por ID
router.get('/:id', async (req, res) => {
  try {
    const prestador = await Prestador.findByPk(req.params.id);
    if (prestador) {
      res.json(prestador);
    } else {
      res.status(404).json({ error: 'Prestador no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar prestador' });
  }
});

// Editar prestador
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Prestador.update(req.body, {
      where: { id: req.params.id }
    });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar prestador' });
  }
});

// Eliminar prestador
router.delete('/:id', async (req, res) => {
  try {
    await Prestador.destroy({ where: { id: req.params.id } });
    res.json({ mensaje: 'Prestador eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar prestador' });
  }
});

module.exports = router;

