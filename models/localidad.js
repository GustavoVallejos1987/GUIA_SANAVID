// models/localidad.js
module.exports = (sequelize, DataTypes) => {
  const Localidad = sequelize.define('Localidad', {
    nombre: DataTypes.STRING,
    departamento_id: DataTypes.INTEGER
  }, {
    tableName: 'localidades', // si tu tabla se llama en minúscula
    timestamps: false
  });

  
  Localidad.associate = (models) => {
    Localidad.belongsTo(models.Departamento, {
      foreignKey: 'departamento_id',
      as: 'departamento'
    });

    Localidad.hasMany(models.Prestador, {
      foreignKey: 'localidad_id',
      as: 'prestadores'
    });
  };

  return Localidad;
};

