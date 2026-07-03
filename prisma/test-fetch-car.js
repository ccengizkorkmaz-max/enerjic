async function main() {
  const url = 'https://ev-database.org/car/1701/BMW-iX1-xDrive30';
  console.log(`Fetching detail page: ${url}`);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = await res.text();
    console.log(`Response Status: ${res.status}`);
    console.log("HTML First 1000 chars:");
    console.log(html.substring(0, 1000));
  } catch (e) {
    console.error("Error fetching detail page:", e);
  }
}

main().catch(console.error);
