const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const { Sequelize } = require('sequelize');
if (process.env.NODE_ENV == 'development') {
  module.exports = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      host: 'localhost',
      dialect: 'postgres',
    }
  );
} else if (process.env.NODE_ENV == 'test') {
  module.exports = new Sequelize(
    process.env.DATABASE_TEST,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      host: 'localhost',
      dialect: 'postgres',
      logging: false,
    }
  );
} else if (process.env.NODE_ENV == 'production') {
  module.exports = new Sequelize(process.env.DATABASE_URI, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, //fix for db connection error
      },
    },
  });
}

//module.exports = sequelize;
