const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./src/routers/router');

const PORT = 3001;
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(router);

app.listen(PORT, () => {
  console.log(`API listen on port ${PORT}!`);
});

module.exports = app;
