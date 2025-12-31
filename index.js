const express = require("express");
const app = express();

const AMAZON_TAG = "mywebsit0e2ff-20";

/* =========================
   TEACHER SUPPLY INVENTORY
   ========================= */

const PRODUCTS = [

/* ✏️ Daily Instruction & Teaching Tools */
{ title: "Dry-Erase Markers (Assorted Colors)", category: "Daily Instruction & Teaching Tools", price: "Often $10–$18", store: "Amazon", link: `https://www.amazon.com/s?k=dry+erase+markers+classroom&tag=${AMAZON_TAG}` },
{ title: "Sticky Notes (Various Sizes & Colors)", category: "Daily Instruction & Teaching Tools", price: "Typically $8–$15", store: "Walmart", link: "https://www.walmart.com/search?q=sticky+notes+bulk" },
{ title: "Pocket Charts", category: "Daily Instruction & Teaching Tools", price: "Often $15–$30", store: "Amazon", link: `https://www.amazon.com/s?k=pocket+chart+classroom&tag=${AMAZON_TAG}` },
{ title: "Sentence Strips", category: "Daily Instruction & Teaching Tools", price: "Usually under $10", store: "Amazon", link: `https://www.amazon.com/s?k=sentence+strips+classroom&tag=${AMAZON_TAG}` },
{ title: "Chart Paper (Lined & Unlined)", category: "Daily Instruction & Teaching Tools", price: "Often $12–$25", store: "Staples", link: "https://www.staples.com/chart-paper/cat_CL1416" },

/* 🗂️ Organization & Management */
{ title: "Teacher Desk Organizer & Sorting Trays", category: "Organization & Management", price: "Often $15–$35", store: "Amazon", link: `https://www.amazon.com/s?k=teacher+desk+organizer&tag=${AMAZON_TAG}` },
{ title: "File Folders (Assorted Colors)", category: "Organization & Management", price: "Typically $10–$20", store: "Walmart", link: "https://www.walmart.com/search?q=file+folders+assorted" },
{ title: "Binders (1\"–3\")", category: "Organization & Management", price: "Typically $12–$30", store: "Target", link: "https://www.target.com/s?searchTerm=school+binders" },
{ title: "Label Maker + Extra Labels", category: "Organization & Management", price: "Often $25–$50", store: "Amazon", link: `https://www.amazon.com/s?k=label+maker+teacher&tag=${AMAZON_TAG}` },

/* 🖨️ Paper & Printing */
{ title: "Copy & Printer Paper (Bulk)", category: "Paper & Printing", price: "Often $25–$45", store: "Staples", link: "https://www.staples.com/copy-paper/cat_CL1408" },
{ title: "Cardstock (White & Colors)", category: "Paper & Printing", price: "Typically $10–$20", store: "Amazon", link: `https://www.amazon.com/s?k=cardstock+paper+classroom&tag=${AMAZON_TAG}` },
{ title: "Laminating Sheets (Pouches)", category: "Paper & Printing", price: "Often $15–$30", store: "Amazon", link: `https://www.amazon.com/s?k=laminating+sheets+teacher&tag=${AMAZON_TAG}` },

/* ✂️ Cutting & Craft Supplies */
{ title: "Scissors (Student Safe & Adult)", category: "Cutting & Craft Supplies", price: "Typically $10–$25", store: "Walmart", link: "https://www.walmart.com/search?q=school+scissors+bulk" },
{ title: "Glue Sticks (Classroom Pack)", category: "Cutting & Craft Supplies", price: "Usually under $15", store: "Amazon", link: `https://www.amazon.com/s?k=glue+sticks+bulk+classroom&tag=${AMAZON_TAG}` },
{ title: "Stapler + Staples", category: "Cutting & Craft Supplies", price: "Typically $12–$25", store: "Target", link: "https://www.target.com/s?searchTerm=classroom+stapler" },

/* 🎨 Creative & Makerspace */
{ title: "Construction Paper (Large Packs)", category: "Creative & Makerspace", price: "Typically $12–$25", store: "Amazon", link: `https://www.amazon.com/s?k=construction+paper+bulk&tag=${AMAZON_TAG}` },
{ title: "Pom Poms, Pipe Cleaners & Craft Sets", category: "Creative & Makerspace", price: "Often $15–$35", store: "Amazon", link: `https://www.amazon.com/s?k=classroom+craft+supplies&tag=${AMAZON_TAG}` },

/* 📎 Classroom Tools & Technology */
{ title: "Pencil Sharpener (Electric)", category: "Classroom Tools & Technology", price: "Often $20–$40", store: "Amazon", link: `https://www.amazon.com/s?k=electric+pencil+sharpener+classroom&tag=${AMAZON_TAG}` },
{ title: "Headphones (Student Classroom Set)", category: "Classroom Tools & Technology", price: "Often $30–$70", store: "Amazon", link: `https://www.amazon.com/s?k=classroom+headphones+student+set&tag=${AMAZON_TAG}` },

/* 📌 Display & Decoration */
{ title: "Bulletin Board Borders", category: "Display & Decoration", price: "Usually $6–$15", store: "Amazon", link: `https://www.amazon.com/s?k=bulletin+board+borders+classroom&tag=${AMAZON_TAG}` },
{ title: "Classroom Posters & Visuals", category: "Display & Decoration", price: "Often $15–$30", store: "Staples", link: "https://www.staples.com/classroom-posters/cat_CL1702" },

/* 🧹 Classroom Cleanliness */
{ title: "Disinfecting Wipes & Cleaning Supplies", category: "Classroom Cleanliness", price: "Often $20–$40", store: "Walmart", link: "https://www.walmart.com/search?q=disinfecting+wipes+bulk" },

/* 🧑‍🏫 Assessment & Tracking */
{ title: "Stickers & Student Rewards", category: "Assessment & Tracking", price: "Typically under $15", store: "Amazon", link: `https://www.amazon.com/s?k=teacher+stickers+rewards&tag=${AMAZON_TAG}` },
{ title: "Dry-Erase Pockets & Data Trackers", category: "Assessment & Tracking", price: "Often $15–$30", store: "Amazon", link: `https://www.amazon.com/s?k=dry+erase+pockets+classroom&tag=${AMAZON_TAG}` },

/* 🧒 Student Access & Engagement */
{ title: "Individual Whiteboards & Timers", category: "Student Access & Engagement", price: "Often $20–$40", store: "Amazon", link: `https://www.amazon.com/s?k=student+whiteboards+classroom&tag=${AMAZON_TAG}` },
{ title: "Play Money & Math Manipulatives", category: "Student Access & Engagement", price: "Typically under $20", store: "Target", link: "https://www.target.com/s?searchTerm=play+money+classroom" }

];

/* =========================
   SERVER + UI
   ========================= */

app.get("/", (req, res) => {
  const category = req.query.category || "";

  const filtered = PRODUCTS.filter(p =>
    !category || p.category === category
  );

  const categories = [...new Set(PRODUCTS.map(p => p.category))];

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Chalk & Save</title>
</head>

<body style="margin:0;font-family:Segoe UI,Arial;background:#f6f8f4;color:#2f3e3e;">

<div style="padding:80px 20px;text-align:center;background:#eef1ec;">
  <h1 style="font-size:48px;">✏️ Chalk & Save</h1>
  <p style="font-size:20px;max-width:700px;margin:20px auto;">
    A beautifully organized way for teachers to shop for classroom essentials.
  </p>

  <form>
    <select name="category" style="padding:14px 18px;border-radius:24px;font-size:16px;">
      <option value="">Browse by supply category</option>
      ${categories.map(c => `<option>${c}</option>`).join("")}
    </select>
    <button type="submit" style="margin-left:10px;padding:14px 26px;border-radius:24px;border:none;background:#2f4f4f;color:white;font-size:16px;">
      Browse
    </button>
  </form>
</div>

<div style="max-width:1200px;margin:50px auto;text-align:center;">
  ${filtered.map(p => `
    <div style="display:inline-block;width:300px;margin:18px;padding:26px;background:white;border-radius:22px;box-shadow:0 12px 30px rgba(0,0,0,.08);vertical-align:top;">
      <div style="font-weight:600;font-size:17px;margin-bottom:10px;">${p.title}</div>
      <div style="font-size:14px;color:#777;margin-bottom:8px;">${p.category}</div>
      <div style="font-size:18px;color:#2e7d32;font-weight:bold;margin-bottom:18px;">${p.price}</div>
      <a href="${p.link}" target="_blank" style="display:block;background:#2f4f4f;color:white;padding:14px;border-radius:14px;text-decoration:none;">
        View Options →
      </a>
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
