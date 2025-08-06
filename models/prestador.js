module.exports = (sequelize, DataTypes) => {
  const Prestador = sequelize.define('Prestador', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tipo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    direccion: DataTypes.TEXT,
    telefono: DataTypes.TEXT,
    especialidad: DataTypes.TEXT,
    id_madre: DataTypes.INTEGER,
    es_institucion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    departamento_id: DataTypes.INTEGER,
    localidad_id: DataTypes.INTEGER,

    // ✅ AGREGAR ESTA LÍNEA:
    horario: {
      type: DataTypes.STRING,
      allowNull: true
    }

  }, {
    tableName: 'prestadores',
    timestamps: false
  });

  Prestador.associate = (models) => {
    Prestador.belongsTo(models.Departamento, {
      foreignKey: 'departamento_id',
      as: 'departamento'
    });

    Prestador.belongsTo(models.Localidad, {
      foreignKey: 'localidad_id',
      as: 'localidad'
    });

    Prestador.belongsTo(models.Prestador, {
      foreignKey: 'id_madre',
      as: 'madre'
    });
  };

  return Prestador;
};

