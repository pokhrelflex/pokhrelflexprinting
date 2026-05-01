const { DataTypes } = require('sequelize');
const sequelize = require('../config/postgres');

const Counter = sequelize
  ? sequelize.define('Counter', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      value: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    }, {
      tableName: 'counters',
      timestamps: false,
    })
  : null;

async function getNext(name) {
  if (!Counter || !sequelize) {
    return (Date.now() % 9999) + 1;
  }

  await sequelize.query(
    `INSERT INTO counters (name, value) VALUES (:name, 1)
     ON CONFLICT (name) DO UPDATE SET value = counters.value + 1`,
    { replacements: { name } }
  );

  const [rows] = await sequelize.query(
    'SELECT value FROM counters WHERE name = :name',
    { replacements: { name } }
  );

  return rows[0]?.value ?? 1;
}

module.exports = { getNext };
