const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const parcelRouter = require('./routers/parcelRouter');
const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRoutes');

//database config
const sequelize = require('./Database');
sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.log('Error :', err));

// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log('Database Synced successfullly');
//   })
//   .catch((err) => {
//     console.log('Error', err);
//   });
//initialize express
const app = express();

//json and body parser
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

//routes
app.use('/api/v1/docs', (req, res) => {
  res.sendFile('/readme.html', { root: __dirname });
});
app.use('/api/v1/parcels', parcelRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.get('/dummy', (req, res) => {
  res.status(200).json({
    msg: 'test',
  });
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//plug in global error handler
app.use(globalErrorHandler);
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
