require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5300,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGINS: process.env.CORS_ORIGINS || '',
};
