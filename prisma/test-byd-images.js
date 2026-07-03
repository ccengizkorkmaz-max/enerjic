// Native fetch is available in Node.js v24

async function main() {
  const folders = [
    'Hyundai_IONIQ_5',
    'Hyundai_Ioniq_5',
    'Hyundai_IONIQ_5_2020',
    'Hyundai_IONIQ_5_2021',
    'Hyundai_IONIQ_5_2022',
    'Hyundai_IONIQ_5_2023',
    'Hyundai_IONIQ_5_2024'
  ];

  for (const f of folders) {
    const url = `https://ev-database.org/img/auto/${f}/${f}-01@2x.jpg`;
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      console.log(`Folder: ${f} -> status ${res.status}`);
    } catch (e) {
      console.log(`Folder: ${f} -> error ${e.message}`);
    }
  }
}

main().catch(console.error);
