const express = require('express');
const fetchNumbersAndCompute = require('./type/fetchNumbers');

const app = express();
const PORT = 5000;

app.get('/numbers/:numberid', fetchNumbersAndCompute);

app.listen(PORT, () => {
  console.log(`Microservice running at http://localhost:${PORT}`);
});
