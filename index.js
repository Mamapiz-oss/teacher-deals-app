const express = require("express");
const app = express();

const AMAZON_TAG = "mywebsit0e2ff-20";

/* =========================
   TEACHER SUPPLY INVENTORY
   ========================= */

const PRODUCTS = [
  { title: "Dry-Erase Markers (Assorted Colors)", category: "Daily Instruction", grades: "All", season: "All", price: "Often $10–$18", link: `https://www.amazon.com/s?k=dry+erase+markers+classroom&tag=${AMAZON_TAG}` },
  { title: "Pocket Charts", category: "Daily Instruction", grades: "K–5", season: "All", price: "Often $15–$30", link: `https://www.amazon.com/s?k=pocket+chart+classroom&tag=${AMAZON_TAG}` },
  { title: "Sentence Strips", category: "Daily Instruction", grades: "K–5", season: "All", price: "Usually under $10", link: `https://www.amazon.com/s?k=sentence+strips+classroom&tag=${AMAZON_TAG}` },

  { title: "Teacher Desk Organizer", category: "Organization", grades: "All", season: "Back to School", price: "Often $15–$35", link: `https://www.amazon.com/s?k=teacher+desk+organizer&tag=${AMAZON_TAG}` },
  { title: "Binders (1–3 inch)", category: "Organization", grades: "All", season: "All", price: "Typically $12–$30", link: "https://www.target.com/s?searchTerm=school+binders" },

  { title: "Copy Paper (Bulk)", category: "Paper & Printing", grades: "All", season: "All", price: "Often $25–$45", link: "https://www.staples.com/copy-paper/cat_CL1408" },
  { title: "Laminating Sheets", category: "Paper & Printing", grades: "All", season: "Back to School", price: "Often $15–$30", link: `https://www.amazon.com/s?k=laminating+sheets+teacher&tag=${AMAZON_TAG}` },

  { title: "Glue Sticks (Classroom Pack)", category: "Cutting & Craft", grades: "K–5", season: "All", price: "Usually under $15", link: `https://www.amazon.com/s?k=glue+sticks+bulk+classroom&tag=${AMAZON_TAG}` },

  { title: "Construction Paper (Large Packs)", category: "Creative & Makerspace", grades: "K–5", season: "All", price: "Typically $12–$25", link: `https://www.amazon.com/s?k=construction+paper+bulk&tag=${AMAZON_TAG}` },

  { title: "Headphones (Student Set)", category: "Technology", grades: "All", season: "All", price: "Often $30–$70", link: `https://www.amazon.com/s?k=classroom+headphones+student+set&tag=${AMAZON_TAG}` },

  { title: "Bulletin Board Borders", category: "Display & Decor", grades: "K–5", season: "Back to School", price: "Usually $6–$15", link: `https://www.amazon.com/s?k=bulletin+board+borders+classroom&tag=${AMAZON_TAG}` },

  { title: "Disinfecting Wipes (Bulk)", category: "Cleanliness", grades: "All", season: "All", price: "Often $20–$40", link: "https://www.walmart.com/search?q=disinfecting+wipes+bulk" },

  { title: "Student Reward Stickers", category: "Assessment & Engagement", grades: "K–5", season: "All", price: "Typically under $15", link: `https://www.amazon.com/s?k=teacher+stickers+rewards&tag=${AMAZON_TAG}` }
];

app.get("/", (req, res) => {
  const category = req.query.category || "";
  const grade = req.query.grade || "";
  const season = req.query.season || "";

  const filtered = PRODUCTS.filter(p =>
    (!category || p.category === category) &&
    (!grade || p.grades === grade || p.grades === "All") &&
    (!season || p.season === season || p.season === "All")
  );

  const unique = key => [...new Set(PRODUCTS.map(p => p[key]))];

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Chalk & Save</title>

<style>
  body {
    margin:0;
    font-family: "Segoe UI", Arial, sans-serif;
    background:#f6f8f4;
    color:#2f3e3e;
    cursor: url("data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'>
        <text x='0' y='24' font-size='24'>✏️</text>
      </svg>
    ") 0 24, auto;
  }

  .card {
    display:inline-block;
    width:300px;
    margin:18px;
    padding:26px;
    background:white;
    border-radius:22px;
    box-shadow:0 12px 30px rgba(0,0,0,.08);
    vertical-align:top;
    transition:transform .2s, box-shadow .2s;
  }

  .card:hover {
    transform:translateY(-6px);
    box-shadow:0 18px 40px rgba(0,0,0,.12);
  }
</style>

</head>

<body>

<!-- HERO / WELCOME -->
<div style="
  background:url('https://images.unsplash.com/photo-1588072432836-e10032774350');
  background-size:cover;
  background-position:center;
  padding:120px 20px;
  text-align:center;
  color:white;
">
  <div style="background:rgba(0,0,0,.45);display:inline-block;padding:50px 60px;border-radius:26px;">
    <h1 style="font-size:52px;margin-bottom:10px;">✏️ Chalk & Save</h1>
    <p style="font-size:22px;max-width:700px;margin:20px auto;">
      Welcome. This is a calm, joyful place to find classroom supplies — made by teachers, for teachers.
    </p>
  </div>
</div>

<!-- FILTERS -->
<div style="text-align:center;padding:40px 20px;background:#eef1ec;">
  <form>
    <select name="category">
      <option value="">Category</option>
      ${unique("category").map(c => `<option>${c}</option>`).join("")}
    </select>
    <select name="grade">
      <option value="">Grade Band</option>
      ${unique("grades").map(g => `<option>${g}</option>`).join("")}
    </select>
    <select name="season">
      <option value="">Season</option>
      ${unique("season").map(s => `<option>${s}</option>`).join("")}
    </select>
    <button type="submit" style="margin-left:10px;padding:12px 26px;border-radius:22px;border:none;background:#2f4f4f;color:white;font-size:16px;">
      Browse
    </button>
  </form>
</div>

<!-- CARDS -->
<div style="max-width:1200px;margin:60px auto;text-align:center;">
  ${filtered.map(p => `
    <div class="card">
      <div style="font-weight:600;font-size:17px;">${p.title}</div>
      <div style="font-size:14px;color:#777;margin:6px 0;">${p.category} • ${p.grades}</div>
      <div style="font-size:18px;color:#2e7d32;font-weight:bold;margin:14px 0;">${p.price}</div>
      <a
  href="${p.link}"
  target="_blank"
  style="
    display:inline-block;
    background:#2f4f4f;
    color:white;
    padding:10px 22px;
    border-radius:22px;
    text-decoration:none;
    font-size:14px;
    font-weight:600;
  "
>
  View Options →
</a>

    </div>
  `).join("")}
</div>

<!-- FOOTER -->
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
