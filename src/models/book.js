module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a title',
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: DataTypes.STRING,
    ISBN: DataTypes.STRING,
  };

  return sequelize.define('Book', schema);
};
