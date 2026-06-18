const { DataTypes } = require('sequelize');
const sequelize = require('../config/postgres');

const EmailOtp = sequelize
  ? sequelize.define('EmailOtp', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // bcrypt hash of the 6-digit code — never store the plaintext.
      codeHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // What the code is for: 'login', 'email_verify', etc.
      purpose: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'email_verify',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      // Set once the code is successfully used — enforces one-time use.
      consumedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Wrong-guess counter; we reject after a few attempts.
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      tableName: 'email_otps',
      timestamps: true,
      indexes: [{ fields: ['email', 'purpose'] }],
    })
  : null;

module.exports = EmailOtp;
