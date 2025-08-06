module.exports = (sequelize, DataTypes) => {
  const Departamento = sequelize.define('Departamento', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'departamentos',
    timestamps: false
  });
Departamento.associate = (models) => {
  Departamento.hasMany(models.Localidad, {
    foreignKey: 'departamento_id',
    as: 'localidades'
  })};

  return Departamento;
};
