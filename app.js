const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

app.get('/dummy', (req, res) => {
  res.status(200).json({
    msg: 'test',
  });
});

module.exports = app;
