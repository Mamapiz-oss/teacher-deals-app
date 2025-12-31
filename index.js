const express = require("express");
const app = express();

const AMAZON_TAG = "mywebsit0e2ff-20";

/* =========================
   MASTER TEACHER INVENTORY
   ========================= */

const PRODUCTS = [

/* DAILY INSTRUCTION */
{ title: "Dry-Erase Markers (Assorted Colors)", category: "Daily Instruction", grades: "All", season: "All", price: "Often $10–$18", link: `https://www.amazon.com/s?k=dry+erase+markers+classroom&tag=${AMAZON_TAG}` },
{ title: "Pocket Charts", category: "Daily Instruction", grades: "K–5", season: "All", price: "Often $15–$30", link: `https://www.amazon.com/s?k=pocket+chart+classroom&tag=${AMAZON_TAG}` },
{ title: "Sentence Strips", category: "Daily Instruction", grades: "K–5", season: "All", price: "Usually under $10", link: `https://www.amazon.com/s?k=sentence+strips+classroom&tag=${AMAZON_TAG}` },

/* ORGANIZATION */
{ title: "Teacher Desk Organizer & Sorting Trays", category: "Organization", grades: "All", season: "Back to School", price: "Often $15–$35", link: `https://www.amazon.com/s?k=teacher+desk+organizer&tag=${AMAZON_TAG}` },
{ title: "Binders (1\"–3\")", category: "Organization", grades: "All", season: "All", price: "Typically $12–$30", link: "https://www.target.com/s?searchTerm=school+binders" },

/* PAPER & PRINTING */
{ title: "Copy & Printer Paper (Bulk)", category: "Paper & Printing", grades: "All", season: "All", price: "Often $25–$45", link: "https://www.staples.com/copy-paper/cat_CL1408" },
{ title: "Laminating Sheets", category: "Paper & Printing", grades: "All", season: "Back to School", price: "Often $15–$30", link: `https://www.amazon.com/s?k=laminating+sheets+teacher&tag=${AMAZON_TAG}` },

/* CUTTING & CRAFT */
{ title: "Glue Sticks (Classroom Pack)", category: "Cutting & Craft", grades: "K–5", season: "All", price: "Usually under $15", link: `https://www.amazon.com/s?k=glue+sticks+bulk+classroom&tag=${AMAZON_TAG}` },
{ title: "Scissors (Student Safe)", category: "Cutting & Craft", grades: "K–5", season: "All", price: "Typically $10–$25", link: "https://www.walmart.com/search?q=school+scissors+bulk" },

/* CREATIVE & MAKERSPACE */
{ title: "Construction Paper (Large Packs)", category: "Creative & Makerspace", grades: "K–5", season: "All", price: "Typically $12–$25", link: `https://www.amazon.com/s?k=construction+paper+bulk&tag=${AMAZON_TAG}` },
{ title: "Craft Supply Assortment", category: "Creative & Makerspace", grades: "K–5", season: "Mid-Year Refresh", price: "Often $15–$35", link: `https://www.amazon.com/s?k=classroom+craft+supplies&tag=${AMAZON_TAG}` },

/* CLASSROOM TECH */
{ title: "Headphones (Student Classroom Set)", category: "Technology", grades: "All", season: "All", price: "Often $30–$70", link: `https://www.amazon.com/s?k=classroom+headphones+student+set&tag=${AMAZON_TAG}` },

/* DISPLAY & DECOR */
{ title: "Bulletin Board Borders", category: "Display & Decor", grades: "K–5", season: "Back to School", price: "Usually $6–$15", link: `https://www.amazon.com/s?k=bulletin+board+borders+classroom&tag=${AMAZON_TAG}` },

/* CLEANLINESS */
{ title: "Disinfecting Wipes (Bulk)", category: "Cleanliness", grades: "All", season: "All", price: "Often $20–$40", link: "https://www.walmart.com/search?q=disinfecting+wipes+bulk" },

/* ASSESSMENT & ENGAGEMENT */
{ title: "Student Reward Stickers", category: "Assessment & Engagement", grades: "K–5", season: "All", price: "Typically under $15", link: `https://www.amazon.com/s?k=teacher+stickers+rewards&tag=${AMAZON_TAG}` },
{ title: "Individual Whiteboards", category: "Assessment & Engagement", grades: "K–5", season: "All", price: "Often $20–$40", link: `https://www.amazon.com/s?k=student+whiteboards+classroom&tag=${AMAZON_TAG}` }
];

/* =========================
   UI + FILTERING
   ========================= */

app.get("/", (req, res) => {
  const category = req.query.category || "";
  const grade = req.query.grade || "";
  const season = req.query.season || "";

  const filtered = PRODUCTS.filter(p =>
    (!category || p.category === category) &&
    (!grade || p.grades === grade || p.grades === "All") &&
    (!season || p.season === season || p.season === "All")
  );

  const unique = (key) => [...new Set(PRODUCTS.map(p => p[key]))];

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Chalk & Save</title>
</head>

<body style="margin:0;font-family:Segoe UI,Arial;background:#f6f8f4;color:#2f3e3e;">

<!-- HERO -->
<div style="background:url('https://images.unsplash.com/photo-1523580846011-d3a5bc25702b');background-size:cover;background-position:center;padding:110px 20px;text-align:center;color:white;">
  <div style="background:rgba(0,0,0,.45);display:inline-block;padding:40px 50px;border-radius:24px;">
    <h1 style="font-size:50px;">✏️ Chalk & Save</h1>
    <p style="font-size:20px;max-width:680px;margin:20px auto;">
      A beautifully organized way for teachers to shop smarter — without the overwhelm.
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
      Filter
    </button>
  </form>
</div>

<!-- CARDS -->
<div style="max-width:1200px;margin:50px auto;text-align:center;">
  ${filtered.map(p => `
    <div style="display:inline-block;width:300px;margin:18px;padding:26px;background:white;border-radius:22px;box-shadow:0 12px 30px rgba(0,0,0,.08);vertical-align:top;">
      <div style="font-weight:600;font-size:17px;">${p.title}</div>
      <div style="font-size:14px;color:#777;margin:6px 0;">${p.category} • ${p.grades}</div>
      <div style="font-size:18px;color:#2e7d32;font-weight:bold;margin:14px 0;">${p.price}</div>
      <a href="${p.link}" target="_blank" style="display:block;background:#2f4f4f;color:white;padding:14px;border-radius:14px;text-decoration:none;">
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
