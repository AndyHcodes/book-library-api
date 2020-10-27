module.exports = (sequelize, DataTypes) => {
  const schema = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'Email is not valid',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allownull: false,
      validate: {
        len: {
          args: [8],
          msg: 'Password is not valid',
        },
      },
    },
  };

  return sequelize.define('Reader', schema);
};
