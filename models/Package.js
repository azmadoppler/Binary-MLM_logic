module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define(
    "Package",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      price: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      underscored: true,
      timestamps: true,
    }
  );

  /**
   * check อีกรอบด้วย
   */
  Package.associate = (models) => {
    Package.hasOne(models.OrderHistory_PackageBuy, {
      foreignKey: {
        name: "packageId",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };

  return Package;
};