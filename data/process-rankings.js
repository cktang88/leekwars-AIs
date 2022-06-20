let chunks = ["rankings1", "rankings2", "rankings3", "rankings4"];
let allLeeks = [];
chunks.forEach((chunk) => {
  let pages = require(`./raw/${chunk}`);
  // each chunk is an array of pages
  let flattened = pages.flatMap((page) => page.ranking);
  allLeeks = allLeeks.concat(flattened);
});

allLeeks = allLeeks.map((l) => ({
  talent: l.talent,
  level: l.level,
  name: l.name,
  id: l.id, // roughly correlated w/ age
}));

const fs = require("fs");
let content = "window.processedData = " + JSON.stringify(allLeeks);
fs.writeFile("./data/processed/out.js", content, (err) => {
  console.error(err);
});
