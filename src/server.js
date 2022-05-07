const connectDB = require('./config/connectDB');

const app = require('./app');

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();
  return app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
};

const server = startServer();

//for unhandled promise rejections rejections
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection 💥 shutting down....');
  server.close(() => {
    process.exit(1);
  });
});

//handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection 💥 shutting down....');

  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
