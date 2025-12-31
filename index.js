const express = require("express");
const app = express();

const AMAZON_TAG = "mywebsit0e2ff-20";

/* =========================
   PRODUCT DATA
   ========================= */

const PRODUCTS = [
  { title: "Dry-Erase Markers", category: "Daily Instruction", grades: "All", season: "All", price: "Often $10–$18", store: "Amazon", image: "✏️", link: `https://www.amazon.com/s?k=dry+erase+markers+classroom&tag=${AMAZON_TAG}` },
  { title: "Pocket Charts", category: "Daily Instruction", grades: "K–5", season: "All", price: "Often $15–$30", store: "Amazon", image: "📊", link: `https://www.amazon.com/s?k=pocket+chart+classroom&tag=${AMAZON_TAG}` },
  { title: "Teacher Desk Organizer", category: "Organization", grades: "All", season: "Back to School", price: "Often $15–$35", store: "Amazon", image: "🗂️", link: `https://www.amazon.com/s?k=teacher+desk+organizer&tag=${AMAZON_TAG}` },
  { title: "Binders (1–3 inch)", category: "Organization", grades: "All", season: "All", price: "Typically $12–$30", store: "Target", image: "📁", link: "https://www.target.com/s?searchTerm=school+binders" },
  { title: "Copy Paper (Bulk)", category: "Paper & Printing", grades: "All", season: "All", price: "Often $25–$45", store: "Staples", image: "📄", link: "https://www.staples.com/copy-paper/cat_CL1408" },
  { title: "Laminating Sheets", category: "Paper & Printing", grades: "All", season: "Back to School", price: "Often $15–$30", store: "Amazon", image: "🖨️", link: `https://www.amazon.com/s?k=laminating+sheets+teacher&tag=${AMAZON_TAG}` },
  { title: "Glue Sticks (Classroom Pack)", category: "Cutting & Craft", grades: "K–5", season: "All", price: "Usually under $15", store: "Amazon", image: "✂️", link: `https://www.amazon.com/s?k=glue+sticks+bulk+classroom&tag=${AMAZON_TAG}` },
  { title: "Bulletin Board Borders", category: "Display & Decor", grades: "K–5", season: "Back to School", price: "Usually $6–$15", store: "Amazon", image: "📌", link: `https://www.amazon.com/s?k=bulletin+board+borders+classroom&tag=${AMAZON_TAG}` }
];

/* =========================
   STORE BADGES
   ========================= */

function storeBadge(store) {
  const map = {
    Amazon: ["🛒", "#232f3e"],
    Target: ["🎯", "#cc0000"],
    Walmart: ["⭐", "#0071ce"],
    Staples: ["📎", "#444"]
  };
  const [icon, color] = map[store];
  return `<span style="background:${color};color:white;padding:6px 14px;border-radius:16px;font-size:13px;font-weight:600;">${icon} ${store}</span>`;
}

/* =========================
   MAIN PAGE
   ========================= */

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Chalk & Save</title>

<style>
body {
  margin:0;
  font-family:'Segoe UI', Arial, sans-serif;
  background:#f6f8f4;
  color:#2f3e3e;
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text x='0' y='24' font-size='24'>✏️</text></svg>") 0 24, auto;
}

.hero {
  background:url('https://images.unsplash.com/photo-1588072432836-e10032774350');
  background-size:cover;
  background-position:center;
  padding:120px 20px;
  text-align:center;
  color:white;
}

.hero-box {
  background:rgba(0,0,0,.45);
  padding:50px 60px;
  border-radius:28px;
  display:inline-block;
}

.grid {
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));
  gap:32px;
  max-width:1200px;
  margin:70px auto;
  padding:0 20px;
}

.card {
  background:white;
  border-radius:26px;
  padding:28px;
  box-shadow:0 14px 35px rgba(0,0,0,.08);
  text-align:center;
  transition:transform .25s, box-shadow .25s;
}

.card:hover {
  transform:translateY(-8px);
  box-shadow:0 22px 45px rgba(0,0,0,.14);
}

.card-image {
  font-size:54px;
  margin-bottom:14px;
}

.button {
  display:inline-block;
  margin-top:12px;
  background:#2f4f4f;
  color:white;
  padding:10px 24px;
  border-radius:22px;
  font-size:14px;
  font-weight:600;
  text-decoration:none;
}
</style>
</head>

<body>

<div class="hero">
  <div class="hero-box">
    <h1 style="font-size:52px;">✏️ Chalk & Save</h1>
    <p style="font-size:22px;max-width:720px;">
      A calm, beautiful place for teachers to shop classroom essentials.
    </p>
  </div>
</div>

<div class="grid">
  ${PRODUCTS.map(p => `
    <div class="card">
      <div class="card-image">${p.image}</div>
      ${storeBadge(p.store)}
      <h3 style="margin:14px 0 6px;">${p.title}</h3>
      <div style="font-size:14px;color:#777;">${p.category} • ${p.grades}</div>
      <div style="font-size:18px;color:#2e7d32;font-weight:bold;margin:12px 0;">${p.price}</div>
      <a class="button" href="${p.link}" target="_blank">View Options →</a>
    </div>
  `).join("")}
</div>

<div style="text-align:center;padding:30px 20px;font-size:14px;color:#666;">
  <p>Prices shown are typical classroom price ranges.</p>
  <p><strong>Affiliate Disclosure:</strong> As an Amazon Associate, I earn from qualifying purchases.</p>
  <p>Made with 💛 for teachers</p>
</div>

</body>
</html>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
