const express = require("express");
const app = express();

const PRODUCTS = [
  // WRITING & BASICS
  { title: "No. 2 Pencils (24 pack)", price: "$5.98", store: "Walmart", featured: true, link: "https://www.walmart.com/search?q=no+2+pencils+teacher" },
  { title: "Erasers (pink, 12 pack)", price: "$3.99", store: "Amazon", featured: false, link: "https://www.amazon.com/s?k=pink+erasers+classroom" },
  { title: "Pencil Sharpener (manual)", price: "$4.49", store: "Target", featured: false, link: "https://www.target.com/s?searchTerm=pencil+sharpener" },

  // MARKERS & ART
  { title: "Crayons (24 pack)", price: "$4.19", store: "Target", featured: true, link: "https://www.target.com/s?searchTerm=crayons+24+pack" },
  { title: "Washable Markers (10 pack)", price: "$5.49", store: "Amazon", featured: false, link: "https://www.amazon.com/s?k=washable+markers+classroom" },
  { title: "Dry Erase Markers (12 pack)", price: "$14.99", store: "Staples", featured: true, link: "https://www.staples.com/dry-erase-markers/cat_CL114" },
  { title: "Colored Pencils (12 pack)", price: "$3.79", store: "Walmart", featured: false, link: "https://www.walmart.com/search?q=colored+pencils+12+pack" },

  // BULLETIN BOARDS & DECOR
  { title: "Bulletin Board Borders (multicolor)", price: "$6.99", store: "Amazon", featured: true, link: "https://www.amazon.com/s?k=bulletin+board+borders+classroom" },
  { title: "Bulletin Board Letters Set", price: "$12.99", store: "Target", featured: false, link: "https://www.target.com/s?searchTerm=bulletin+board+letters" },
  { title: "Classroom Posters Set", price: "$18.99", store: "Staples", featured: false, link: "https://www.staples.com/classroom-posters/cat_CL1702" },

  // PAPER & ORGANIZATION
  { title: "Chart Paper Pad (25 sheets)", price: "$14.49", store: "Staples", featured: true, link: "https://www.staples.com/chart-paper/cat_CL1416" },
  { title: "Sentence Strips (100 pack)", price: "$7.99", store: "Amazon", featured: false, link: "https://www.amazon.com/s?k=sentence+strips+classroom" },
  { title: "Sticky Notes (12 pack)", price: "$9.99", store: "Walmart", featured: false, link: "https://www.walmart.com/search?q=sticky+notes+12+pack" },

  // STORAGE & CLASSROOM TOOLS
  { title: "Plastic Storage Bins (set of 6)", price: "$19.99", store: "Target", featured: true, link: "https://www.target.com/s?searchTerm=plastic+storage+bins" },
  { title: "Teacher Caddy Organizer", price: "$14.99", store: "Amazon", featured: false, link: "https://www.amazon.com/s?k=teacher+caddy+organizer" },

  // INCENTIVES
  { title: "Stickers (1000 pack)", price: "$8.49", store: "Walmart", featured: false, link: "https://www.walmart.com/search?q=teacher+stickers" },
  { title: "Prize Box Toys (assorted)", price: "$16.99", store: "Amazon", featured: true, link: "https://www.amazon.com/s?k=prize+box+toys+classroom" }
];

function storeBadge(store) {
  const styles = {
    Walmart: "background:#0071ce;color:white;",
    Amazon: "background:#232f3e;color:white;",
    Target: "background:#cc0000;color:white;",
    Staples: "background:#444;color:white;"
  };
  return `<span style="${styles[store]}padding:6px 14px;border-radius:18px;font-size:13px;font-weight:600;">${store}</span>`;
}

app.get("/", (req, res) => {
  const query = (req.query.q || "").toLowerCase();
  const filtered = PRODUCTS.filter(p => p.title.toLowerCase().includes(query));

  res.send(`
    <div style="font-family:Segoe UI,Arial;background:#f8faf7;padding:60px;text-align:center;">
      <h1>✏️ Chalk & Save</h1>
      <p>Teacher-tested. Budget-approved.</p>

      ${filtered.map(p => `
        <div style="display:inline-block;width:280px;margin:16px;padding:22px;background:white;border-radius:18px;box-shadow:0 10px 25px rgba(0,0,0,.08);">
          ${storeBadge(p.store)}<br><br>
          <strong>${p.title}</strong><br><br>
          <span style="color:#2e7d32;font-size:24px;font-weight:bold;">${p.price}</span><br><br>
          <a href="${p.link}" target="_blank" style="display:block;background:#2f4f4f;color:white;padding:12px;border-radius:10px;text-decoration:none;">
            View Deal →
          </a>
        </div>
      `).join("")}
    </div>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
