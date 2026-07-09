const https = require('https');

function checkPage(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log(`\n=== Checking: ${url} ===`);
        console.log('Has a-ads.com:', d.includes('a-ads.com'));
        console.log('Has ad-unit:', d.includes('ad-unit'));
        
        // Find all a-ads references
        const refs = d.match(/a-ads\.com[^"'\s]*/g);
        console.log('A-ads refs:', refs);
        
        // Find iframe tags with a-ads
        const iframes = d.match(/<iframe[^>]*a-ads[^>]*>/g);
        console.log('Iframes:', iframes);
        
        // Check if it's SSR or client-rendered
        console.log('Has AdSkeleton:', d.includes('AdSkeleton') || d.includes('ad-skeleton'));
        console.log('Has Sponsorlu:', d.includes('Sponsorlu'));
        
        resolve();
      });
    });
  });
}

async function main() {
  await checkPage('https://enerjic.com/');
  await checkPage('https://enerjic.com/haber/elektrikli-araclarda-siber-guvenlik');
}

main();
