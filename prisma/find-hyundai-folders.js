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
    'Hyundai_IONIQ_5',
    'Hyundai_Ioniq_5',
    'Hyundai_IONIQ_5_N',
    'Hyundai_IONIQ_5_Project_45',
    'Hyundai_IONIQ5',
    'Hyundai_Ioniq5',
    'Hyundai_Ioniq_5_2021',
    'Hyundai_Ioniq_5_2022',
    'Hyundai_Ioniq_5_2023',
    'Hyundai_Ioniq_5_2024',
    'Hyundai_IONIQ_5_2025',
    'Hyundai_IONIQ_5_2021',
    'Hyundai_IONIQ_5_2022',
    'Hyundai_IONIQ_5_2023',
    'Hyundai_IONIQ_5_2024',
    'Hyundai_IONIQ_5_2025',
    'Hyundai_Ioniq_6',
    'Hyundai_IONIQ_6',
    'Hyundai_IONIQ_6_2022',
    'Hyundai_IONIQ_6_2023'
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
