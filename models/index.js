const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false
  }
);

// Cargar modelos
const Prestador = require('./prestador')(sequelize, DataTypes);
const Departamento = require('./departamento')(sequelize, DataTypes);
const Localidad = require('./localidad')(sequelize, DataTypes);
const Usuario = require('./usuario')(sequelize, DataTypes); // ✅ Agregado

// Objeto para exportar
const db = {
  sequelize,
  Sequelize,
  Prestador,
  Departamento,
  Localidad,
  Usuario
};
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // 💡 Esto es clave para que todo se relacione
  }
});

module.exports = db;
