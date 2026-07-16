const https = require('https');

const url = "https://ev-database.org/img/auto/Tesla_Model_3/Tesla_Model_3-01@2x.jpg";

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://ev-database.org/'
  }
}, (res) => {
  console.log("Status Code:", res.statusCode);
  console.log("Headers:", res.headers);
}).on('error', (e) => {
  console.error("Connection Error:", e.message);
});
