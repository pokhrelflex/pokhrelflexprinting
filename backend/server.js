const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config/environment');
const { errorHandler, notFoundHandler } = require('./middleware/validation');

const formsRoutes = require('./routes/forms');
const sequelize = require('./config/postgres');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const isProduction = process.env.NODE_ENV === 'production';

const defaultProdOrigins = [
  'https://pokhrelflexprinting.vercel.app',
  'https://pokhrelflexprinting.com',
  'https://www.pokhrelflexprinting.com'
];

const defaultDevOrigins = [
  'http://localhost:3300', 'http://localhost:3001', 'http://localhost:5173',
  'http://127.0.0.1:3300', 'http://127.0.0.1:5173'
];

const envOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : null;

const baseAllowedOrigins = envOrigins || (isProduction ? defaultProdOrigins : defaultDevOrigins);

const corsOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);
  if (!isProduction) return callback(null, true);
  if (baseAllowedOrigins.includes(origin)) return callback(null, true);
  if (origin.endsWith('.vercel.app')) return callback(null, true);
  callback(new Error('Not allowed by CORS'));
};

app.use(cors({ origin: corsOrigin, credentials: true }));
app.options('*', cors({ origin: corsOrigin, credentials: true }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const distPath = path.join(__dirname, '..', 'dist');
const fs = require('fs');
const distExists = fs.existsSync(distPath);
if (isProduction || distExists) {
  app.use(express.static(distPath));
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Pokhrel Flex Printing Backend is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/forms', formsRoutes);

app.all('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  if ((isProduction || distExists) && fs.existsSync(path.join(distPath, 'index.html'))) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

app.use(notFoundHandler);
app.use(errorHandler);

const gracefulShutdown = () => {
  console.log('\n🛑 Shutting down gracefully...');
  if (sequelize) {
    sequelize.close().then(() => {
      console.log('📊 PostgreSQL connection closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const startServer = async () => {
  if (sequelize) {
    try {
      await sequelize.authenticate();
      console.log('✅ PostgreSQL connected successfully');
      await sequelize.sync({ force: false });
      console.log('📊 Tables synced');
    } catch (pgError) {
      console.error('❌ PostgreSQL connection failed:', pgError.message);
      console.log('🔄 Server will continue without PostgreSQL');
    }
  }

  const server = app.listen(config.PORT, () => {
    console.log(`\n🚀 Server running on port ${config.PORT}`);
    console.log(`📱 Environment: ${config.NODE_ENV}`);
    console.log(`🌐 Local: http://localhost:${config.PORT}`);
    console.log(`\n📝 Available Endpoints:`);
    console.log('   GET  /api/health         — Health check');
    console.log('   POST /api/forms/contact  — Contact form');
    console.log('   POST /api/forms/newsletter — Newsletter');
    console.log('   POST /api/forms/inquiry  — Product inquiry');
    console.log('\n✨ Ready to accept requests!');
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${config.PORT} is already in use`);
    } else {
      console.error('❌ Server error:', error);
    }
    process.exit(1);
  });
};

if (require.main === module) {
  startServer().catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
} else {
  // Serverless context — authenticate + sync without blocking
  if (sequelize) {
    sequelize.authenticate()
      .then(() => sequelize.sync({ force: false }))
      .catch(err => console.warn('DB init warning:', err.message));
  }
}

module.exports = app;
