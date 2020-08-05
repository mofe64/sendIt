const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Sequelize = require('sequelize');
const app = require('./app');
const db = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
  }
);

const connection = async () => {
  try {
    await db.authenticate();
    console.log('DB connection successful');
  } catch (error) {
    console.log('DB connection failed', error);
  }
};
connection();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running in ${process.env.NODE_ENV} mode on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled rejection, Shutting down....');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;
