const express = require("express");
const app = express();

const AMAZON_TAG = "mywebsit0e2ff-20";

const PRODUCTS = [
  { title: "No. 2 Pencils (24 pack)", price: "Typically under $6", store: "Walmart", featured: true, link: "https://www.walmart.com/search?q=no+2+pencils+teacher" },
  { title: "Erasers (pink, 12 pack)", price: "Usually $3–$5", store: "Amazon", featured: false, link: `https://www.amazon.com/s?k=pink+erasers+classroom&tag=${AMAZON_TAG}` },
  { title: "Crayons (24 pack)", price: "Usually under $5", store: "Target", featured: true, link: "https://www.target.com/s?searchTerm=crayons+24+pack" },
  { title: "Washable Markers (10 pack)", price: "Typically $5–$7", store: "Amazon", featured: false, link: `https://www.amazon.com/s?k=washable+markers+classroom&tag=${AMAZON_TAG}` },
  { title: "Bulletin Board Borders", price: "Usually $6–$10", store: "Amazon", featured: true, link: `https://www.amazon.com/s?k=bulletin+board+borders+classroom&tag=${AMAZON_TAG}` },
  { title: "Chart Paper Pad", price: "Often $12–$18", store: "Staples", featured: false, link: "https://www.staples.com/chart-paper/cat_CL1416" },
  { title: "Plastic Storage Bins (set of 6)", price: "Often $18–$25", store: "Target", featured: false, link: "https://www.target.com/s?searchTerm=plastic+storage+bins" },
  { title: "Prize Box Toys", price: "Often $15–$20", store: "Amazon", featured: true, link: `https://www.amazon.com/s?k=prize+box+toys+classroom&tag=${AMAZON_TAG}` }
];

function storeBadge(store) {
  const styles = {
    Walmart: "#0071ce",
    Amazon: "#232f3e",
    Target: "#cc0000",
    Staples: "#444"
  };
  return `
    <span style="
      background:${styles[store]};
      color:white;
      padding:6px 14px;
      border-radius:18px;
      font-size:13px;
      font-weight:600;
      display:inline-block;
    ">
      ${store}
    </span>
  `;
}

app.get("/", (req, res) => {
  const query = (req.query.q || "").toLowerCase();
  const filtered = PRODUCTS.filter(p => p.title.toLowerCase().includes(query));

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Chalk & Save</title>
</head>

<body style="
  margin:0;
  font-family:'Segoe UI', Arial, sans-serif;
  background:linear-gradient(180deg,#f6f8f4,#eef1ec);
  color:#2f3e3e;
">

<!-- HERO -->
<div style="
  padding:70px 20px 50px;
  text-align:center;
">
  <h1 style="font-size:44px;margin-bottom:10px;">✏️ Chalk & Save</h1>

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

  <p style="max-width:620px;margin:20px auto 30px;font-size:18px;color:#556b6b;">
    A calm, curated place for teachers to find classroom essentials without the overwhelm.
  </p>

  <form>
    <input
      type="text"
      name="q"
      value="${query}"
      placeholder="Search borders, markers, storage…"
      style="
        width:320px;
        padding:14px 18px;
        border-radius:30px;
        border:1px solid #ccc;
        font-size:16px;
      "
    />
    <button
      type="submit"
      style="
        margin-left:8px;
        padding:14px 24px;
        border-radius:30px;
        border:none;
        background:#2f4f4f;
        color:white;
        font-size:16px;
        cursor:pointer;
      "
    >
      Search
    </button>
  </form>
</div>

<!-- CARDS -->
<div style="max-width:1100px;margin:0 auto 60px;text-align:center;">
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

      ${p.featured ? `
        <div style="
          position:absolute;
          top:16px;
          right:16px;
          background:#f4c430;
          color:#5a4600;
          font-size:12px;
          font-weight:bold;
          padding:6px 12px;
          border-radius:20px;
        ">
          ⭐ Teacher Pick
        </div>
      ` : ""}

      <div style="margin-bottom:14px;">
        ${storeBadge(p.store)}
      </div>

      <div style="font-size:17px;font-weight:600;margin-bottom:12px;">
        ${p.title}
      </div>

      <div style="font-size:18px;color:#2e7d32;font-weight:bold;margin-bottom:18px;">
        ${p.price}
      </div>

      <a
        href="${p.link}"
        target="_blank"
        style="
          display:block;
          background:#2f4f4f;
          color:white;
          padding:14px;
          border-radius:14px;
          font-size:15px;
          text-decoration:none;
        "
      >
        View Deal →
      </a>
    </div>
  `).join("")}
</div>

<!-- FOOTER -->
<div style="
  text-align:center;
  padding:30px 20px;
  font-size:14px;
  color:#666;
">
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
