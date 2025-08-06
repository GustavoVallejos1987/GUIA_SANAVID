const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ para servir archivos estáticos
require('dotenv').config();

const app = express();
const usuariosRoutes = require('./routes/usuarios');

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Servir la carpeta 'public' como contenido estático
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos
const db = require('./models');
db.sequelize.authenticate()
  .then(() => console.log('✅ Conexión a la BD exitosa'))
  .catch((err) => console.error('❌ Error al conectar a la BD:', err));


 

// Rutas de la API
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/sanatorios', require('./routes/sanatorios'));
app.use('/api/especialidades', require('./routes/especialidades'));
app.use('/api/localidades', require('./routes/localidades'));
app.use('/api/laboratorios', require('./routes/laboratorios'));
app.use('/api/diagnosticos', require('./routes/diagnosticos'));
app.use('/api/tipo_institucion', require('./routes/tipo_institucion'));
app.use('/api/prestadores', require('./routes/prestadores'));
app.use('/api/departamentos', require('./routes/departamentos'));
app.use('/api/usuarios', usuariosRoutes); 

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://127.0.0.1:${PORT}`);
  console.log(`🌐 Accedé a tu frontend en http://127.0.0.1:${PORT}/prestadores.html`);
});


