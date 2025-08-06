module.exports = (sequelize, DataTypes) => {
  const Sanatorio = sequelize.define('Sanatorio', {
    nombre: DataTypes.STRING,
    ciudad: DataTypes.STRING,
    departamento: DataTypes.STRING,
    direccion: DataTypes.STRING,
    telefono: DataTypes.STRING,
    email: DataTypes.STRING,       // NUEVO
    horario: DataTypes.STRING      // NUEVO
  });

  return Sanatorio;
};
