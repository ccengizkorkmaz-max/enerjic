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
  const folders = [
    'Mercedes_EQS',
    'Mercedes_EQS_2021',
    'Mercedes_Benz_EQS',
    'Mercedes-Benz_EQS',
    'Mercedes_EQE',
    'Mercedes_EQA',
    'Mercedes_EQB',
    'Mercedes_Benz_EQE',
    'Mercedes-Benz_EQE'
  ];

  for (const f of folders) {
    const url = `https://ev-database.org/img/auto/${f}/${f}-01@2x.jpg`;
    const ok = await checkUrl(url);
    if (ok) {
      console.log(`SUCCESS: ${f}`);
    } else {
      console.log(`404: ${f}`);
    }
  }
}

main().catch(console.error);
