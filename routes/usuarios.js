const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

// ✅ Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol']
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
});

// Ruta para registrar un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // encriptar la contraseña

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol
    });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
});


// Ruta para login de usuario con nombre y contraseña
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body; // 👈 CAMBIADO de "email" a "usuario"

  try {
    const user = await Usuario.findOne({ where: { nombre: usuario } }); // 👈 busca por nombre
    if (!user) return res.status(401).json({ mensaje: "Credenciales inválidas" });

    const valido = await bcrypt.compare(password, user.password);
    if (!valido) return res.status(401).json({ mensaje: "Credenciales inválidas" });

    res.json({
      mensaje: "Login correcto",
      usuario: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
});


module.exports = router;


