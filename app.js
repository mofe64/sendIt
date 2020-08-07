const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const parcelRouter = require('./routers/parcelRouter');

//database config
const sequelize = require('./Database');
sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.log('Error :', err));

//initialize express
const app = express();

//json and body parser
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

//routes
app.use('/api/v1/parcels', parcelRouter);

app.get('/dummy', (req, res) => {
  res.status(200).json({
    msg: 'test',
  });
});

//server setup
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
