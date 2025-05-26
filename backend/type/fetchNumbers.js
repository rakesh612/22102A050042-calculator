const axios = require('axios');


const TYPE_MAP = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'rand'
};

const API_BASE = 'http://20.244.56.144/evaluation-service';
const WINDOW_SIZE = 10;
let windowState = [];

module.exports = async function fetchNumbersAndCompute(req, res) {
  const id = req.params.numberid;

  if (!TYPE_MAP[id]) {
    return res.status(400).json({ error: 'Invalid number ID. Use p, f, e, or r' });
  }

  const apiUrl = `${API_BASE}/${TYPE_MAP[id]}`;
  const prevState = [...windowState];
  let numbers = [];

  try {
    const response = await Promise.race([
      axios.get(apiUrl),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 500))
    ]);

    numbers = response.data.numbers || [];
  } catch (err) {
    console.error(`Failed fetching from ${apiUrl}:`, err.message);
    return res.status(503).json({
      windowPrevState: prevState,
      windowCurrState: windowState,
      numbers: [],
      avg: average(windowState)
    });
  }


  for (const num of numbers) {
    if (!windowState.includes(num)) {
      windowState.push(num);
      if (windowState.length > WINDOW_SIZE) {
        windowState.shift();
      }
    }
  }

  return res.json({
    windowPrevState: prevState,
    windowCurrState: windowState,
    numbers: numbers,
    avg: average(windowState)
  });
};

function average(arr) {
  if (arr.length === 0) return 0.0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / arr.length).toFixed(2));
}
