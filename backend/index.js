require('dotenv').config();
const express = require('express');
const fetchNumbersAndCompute = require('./type/fetchNumbers');

const app = express();
const PORT = 9876;

app.get('/numbers/:numberid', fetchNumbersAndCompute);

app.listen(PORT, () => {
  console.log(`✅ Microservice running at http://localhost:${PORT}`);
});
