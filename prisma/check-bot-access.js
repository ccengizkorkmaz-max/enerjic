const https = require('https');

// Simulate a bot visit (no browser user-agent)
const options = {
  hostname: 'enerjic.com',
  path: '/',
  method: 'GET',
  headers: {
    // Simple bot-like user agent (similar to what A-Ads bot might use)
    'User-Agent': 'Mozilla/5.0 (compatible; a-ads-bot/1.0)',
    'Accept': 'text/html',
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log('\nBody length:', body.length);
    console.log('Has a-ads:', body.includes('a-ads'));
    console.log('Has Cloudflare challenge:', body.includes('challenge') || body.includes('cf-') || body.includes('turnstile'));
    console.log('Has "Just a moment":', body.includes('Just a moment'));
    console.log('Has "Checking your browser":', body.includes('Checking'));
    console.log('Has meta refresh:', body.includes('meta http-equiv="refresh"'));
    
    // Show first 500 chars to see what the bot sees
    console.log('\n--- First 500 chars of response ---');
    console.log(body.substring(0, 500));
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();
