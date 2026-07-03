const fs = require('fs');
const path = require('path');

const seedFile = path.join(__dirname, 'seed-real-articles.js');
if (!fs.existsSync(seedFile)) {
  console.error("seed-real-articles.js not found!");
  process.exit(1);
}

let content = fs.readFileSync(seedFile, 'utf-8');

const replacements = [
  {
    from: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800",
    to: "https://images.pexels.com/photos/244553/pexels-photo-244553.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1519074069444-1ba4e6663104?w=800",
    to: "https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800",
    to: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
    to: "https://images.pexels.com/photos/9796017/pexels-photo-9796017.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800",
    to: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?w=800",
    to: "https://images.pexels.com/photos/9800007/pexels-photo-9800007.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
    to: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=800",
    to: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
    to: "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    to: "https://images.pexels.com/photos/3183158/pexels-photo-3183158.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
    to: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800",
    to: "https://images.pexels.com/photos/5849577/pexels-photo-5849577.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1617791160505-6f006e121980?w=800",
    to: "https://images.pexels.com/photos/459702/pexels-photo-459702.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    to: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    from: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
    to: "https://images.pexels.com/photos/9796024/pexels-photo-9796024.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

let replacedCount = 0;
for (const r of replacements) {
  if (content.includes(r.from)) {
    content = content.replace(new RegExp(escapeRegExp(r.from), 'g'), r.to);
    replacedCount++;
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

fs.writeFileSync(seedFile, content, 'utf-8');
console.log(`Successfully replaced ${replacedCount} Unsplash image URLs with Pexels URLs!`);
