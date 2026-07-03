const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Fetching ev-database.org homepage to search for embedded data...");
  const res = await fetch('https://ev-database.org/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!res.ok) {
    console.error(`Failed to fetch homepage: status ${res.status}`);
    return;
  }

  const html = await res.text();
  console.log(`Fetched HTML size: ${html.length} bytes`);

  // Search for any large script tags or json links
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
  let match;
  let scriptCount = 0;
  while ((match = scriptRegex.exec(html)) !== null) {
    const content = match[1];
    scriptCount++;
    if (content.length > 5000) {
      console.log(`Script tag #${scriptCount} has large content (Size: ${content.length} bytes). First 200 chars:`);
      console.log(content.trim().slice(0, 200));
      // Write it to a temp file for inspection
      const tempPath = path.join(__dirname, '..', `temp_script_${scriptCount}.js`);
      fs.writeFileSync(tempPath, content);
      console.log(`  Saved to ${tempPath}`);
    }
  }

  // Also check for any JSON links in src attributes
  const jsonLinkRegex = /src="([^"]+\.json)"/g;
  let jsonMatch;
  while ((jsonMatch = jsonLinkRegex.exec(html)) !== null) {
    console.log(`Found JSON link: ${jsonMatch[1]}`);
  }
}

main().catch(console.error);
