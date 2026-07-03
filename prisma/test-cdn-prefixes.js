async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

async function main() {
  const slug = 'BMW-iX1-xDrive30';
  const parts = slug.split('-');

  // Generate prefix candidates
  // E.g. BMW, BMW_iX1, BMW_iX1_xDrive30, etc.
  const candidates = [];
  
  // Try joins with underscores
  for (let i = 1; i <= parts.length; i++) {
    candidates.push(parts.slice(0, i).join('_'));
  }
  // Try joins with dashes
  for (let i = 1; i <= parts.length; i++) {
    candidates.push(parts.slice(0, i).join('-'));
  }

  console.log("Candidates generated:", candidates);

  for (const cand of candidates) {
    const url = `https://ev-database.org/img/auto/${cand}/${cand}-01@2x.jpg`;
    const ok = await checkUrl(url);
    if (ok) {
      console.log(`  -> SUCCESS: ${url}`);
    } else {
      console.log(`  -> 404: ${cand}`);
    }
  }
}

main().catch(console.error);
