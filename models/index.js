const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Cargar modelos
const Prestador = require('./prestador')(sequelize, DataTypes);
const Departamento = require('./departamento')(sequelize, DataTypes);
const Localidad = require('./localidad')(sequelize, DataTypes);
const Usuario = require('./usuario')(sequelize, DataTypes);

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
    db[modelName].associate(db);
  }
});

module.exports = db;

