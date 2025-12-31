const express = require("express");
const app = express();

const AMAZON_TAG = "mywebsit0e2ff-20";

const PRODUCTS = [
  { title: "No. 2 Pencils (24 pack)", category: "Writing", price: "Typically under $6", store: "Walmart", featured: true, link: "https://www.walmart.com/search?q=no+2+pencils+teacher" },
  { title: "Erasers (pink, 12 pack)", category: "Writing", price: "Usually $3–$5", store: "Amazon", featured: false, link: `https://www.amazon.com/s?k=pink+erasers+classroom&tag=${AMAZON_TAG}` },

  { title: "Crayons (24 pack)", category: "Art", price: "Usually under $5", store: "Target", featured: true, link: "https://www.target.com/s?searchTerm=crayons+24+pack" },
  { title: "Washable Markers (10 pack)", category: "Art", price: "Typically $5–$7", store: "Amazon", featured: false, link: `https://www.amazon.com/s?k=washable+markers+classroom&tag=${AMAZON_TAG}` },

  { title: "Bulletin Board Borders", category: "Decor", price: "Usually $6–$10", store: "Amazon", featured: true, link: `https://www.amazon.com/s?k=bulletin+board+borders+classroom&tag=${AMAZON_TAG}` },

  { title: "Chart Paper Pad", category: "Organization", price: "Often $12–$18", store: "Staples", featured: false, link: "https://www.staples.com/chart-paper/cat_CL1416" },
  { title: "Plastic Storage Bins (set of 6)", category: "Organization", price: "Often $18–$25", store: "Target", featured: false, link: "https://www.target.com/s?searchTerm=plastic+storage+bins" },

  { title: "Prize Box Toys", category: "Incentives", price: "Often $15–$20", store: "Amazon", featured: true, link: `https://www.amazon.com/s?k=prize+box+toys+classroom&tag=${AMAZON_TAG}` }
];

function storeBadge(store) {
  const colors = {
    Walmart: "#0071ce",
    Amazon: "#232f3e",
    Target: "#cc0000",
    Staples: "#444"
  };
  return `<span style="background:${colors[store]};color:white;padding:6px 14px;border-radius:18px;font-size:13px;font-weight:600;">${store}</span>`;
}

app.get("/", (req, res) => {
  const query = (req.query.q || "").toLowerCase();
  const category = req.query.category || "";

  const filtered = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(query) &&
    (!category || p.category === category)
  );

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Chalk & Save</title>
</head>

<body style="margin:0;font-family:'Segoe UI',Arial;background:#f6f8f4;color:#2f3e3e;">

<!-- HERO -->
<div style="
  background:url('https://images.unsplash.com/photo-1588072432836-e10032774350');
  background-size:cover;
  background-position:center;
  padding:100px 20px;
  text-align:center;
  color:white;
">
  <div style="
    background:rgba(0,0,0,.45);
    display:inline-block;
    padding:40px 50px;
    border-radius:20px;
  ">
    <h1 style="font-size:48px;margin-bottom:10px;">✏️ Chalk & Save</h1>
    <div style="
      display:inline-block;
      background:#f4f0e6;
      color:#5a4a2f;
      padding:8px 18px;
      border-radius:20px;
      font-weight:600;
      margin-bottom:20px;
    ">
      Teacher-tested. Budget-approved.
    </div>
    <p style="max-width:620px;margin:20px auto 0;font-size:18px;">
      A beautiful, stress-free way for teachers to find classroom essentials.
    </p>
  </div>
</div>

<!-- FILTER BAR -->
<div style="text-align:center;padding:40px 20px;background:#eef1ec;">
  <form>
    <select name="category" style="padding:12px 16px;border-radius:20px;font-size:16px;">
      <option value="">Browse by category</option>
      <option>Writing</option>
      <option>Art</option>
      <option>Decor</option>
      <option>Organization</option>
      <option>Incentives</option>
    </select>
    <button type="submit" style="
      margin-left:10px;
      padding:12px 24px;
      border-radius:20px;
      border:none;
      background:#2f4f4f;
      color:white;
      font-size:16px;
    ">
      Go
    </button>
  </form>
</div>

<!-- CARDS -->
<div style="max-width:1100px;margin:40px auto 60px;text-align:center;">
  ${filtered.map(p => `
    <div style="
      display:inline-block;
      width:280px;
      margin:18px;
      padding:26px;
      background:white;
      border-radius:22px;
      box-shadow:0 12px 30px rgba(0,0,0,.08);
      vertical-align:top;
      position:relative;
    ">
      ${p.featured ? `<div style="position:absolute;top:16px;right:16px;background:#f4c430;color:#5a4600;font-size:12px;font-weight:bold;padding:6px 12px;border-radius:20px;">⭐ Teacher Pick</div>` : ""}
      <div style="margin-bottom:14px;">${storeBadge(p.store)}</div>
      <div style="font-size:17px;font-weight:600;margin-bottom:12px;">${p.title}</div>
      <div style="font-size:18px;color:#2e7d32;font-weight:bold;margin-bottom:18px;">${p.price}</div>
      <a href="${p.link}" target="_blank" style="
        display:block;
        background:#2f4f4f;
        color:white;
        padding:14px;
        border-radius:14px;
        font-size:15px;
        text-decoration:none;
      ">
        View Deal →
      </a>
    </div>
  `).join("")}
</div>

<!-- FOOTER -->
<div style="text-align:center;padding:30px 20px;font-size:14px;color:#666;">
  <p>Prices shown are typical classroom price ranges.</p>
  <p><strong>Affiliate Disclosure:</strong> As an Amazon Associate, I earn from qualifying purchases.</p>
  <p style="margin-top:12px;">Made with 💛 for teachers</p>
</div>

</body>
</html>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
