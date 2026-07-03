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
  const variations = [
    'Hyundai_IONIQ6_2022',
    'Hyundai_Ioniq_6_2022',
    'Hyundai_Ioniq_6',
    'Hyundai_IONIQ_6_2022',
    'Hyundai_IONIQ6',
    'Hyundai_Ioniq6_2022',
    'Hyundai_Ioniq6',
    'Hyundai_IONIQ_6',
    'Hyundai_IONIQ-6'
  ];

  for (const v of variations) {
    const url = `https://ev-database.org/img/auto/${v}/${v}-01@2x.jpg`;
    const ok = await checkUrl(url);
    console.log(`Folder: ${v} -> ${ok ? 'SUCCESS' : '404'}`);
  }
}

main().catch(console.error);
