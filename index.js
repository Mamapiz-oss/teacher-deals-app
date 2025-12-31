const express = require("express");
const app = express();

const PRODUCTS = [
  // WRITING & BASICS
  { title: "No. 2 Pencils (24 pack)", price: "$5.98", store: "Walmart", featured: true, link: "https://www.walmart.com" },
  { title: "Erasers (pink, 12 pack)", price: "$3.99", store: "Amazon", featured: false, link: "https://www.amazon.com" },
  { title: "Pencil Sharpener (manual)", price: "$4.49", store: "Target", featured: false, link: "https://www.target.com" },

  // MARKERS & ART
  { title: "Crayons (24 pack)", price: "$4.19", store: "Target", featured: true, link: "https://www.target.com" },
  { title: "Washable Markers (10 pack)", price: "$5.49", store: "Amazon", featured: false, link: "https://www.amazon.com" },
  { title: "Dry Erase Markers (12 pack)", price: "$14.99", store: "Staples", featured: true, link: "https://www.staples.com" },
  { title: "Colored Pencils (12 pack)", price: "$3.79", store: "Walmart", featured: false, link: "https://www.walmart.com" },

  // BULLETIN BOARDS & DECOR
  { title: "Bulletin Board Borders (multicolor)", price: "$6.99", store: "Amazon", featured: true, link: "https://www.amazon.com" },
  { title: "Bulletin Board Letters Set", price: "$12.99", store: "Target", featured: false, link: "https://www.target.com" },
  { title: "Classroom Posters Set", price: "$18.99", store: "Staples", featured: false, link: "https://www.staples.com" },

  // PAPER & ORGANIZATION
  { title: "Chart Paper Pad (25 sheets)", price: "$14.49", store: "Staples", featured: true, link: "https://www.staples.com" },
  { title: "Sentence Strips (100 pack)", price: "$7.99", store: "Amazon", featured: false, link: "https://www.amazon.com" },
  { title: "Sticky Notes (12 pack)", price: "$9.99", store: "Walmart", featured: false, link: "https://www.walmart.com" },

  // STORAGE & CLASSROOM TOOLS
  { title: "Plastic Storage Bins (set of 6)", price: "$19.99", store: "Target", featured: true, link: "https://www.target.com" },
  { title: "Teacher Caddy Organizer", price: "$14.99", store: "Amazon", featured: false, link: "https://www.amazon.com" },

  // INCENTIVES
  { title: "Stickers (1000 pack)", price: "$8.49", store: "Walmart", featured: false, link: "https://www.walmart.com" },
  { title: "Prize Box Toys (assorted)", price: "$16.99", store: "Amazon", featured: true, link: "https://www.amazon.com" }
];

function storeBadge(store) {
  const styles = {
    Walmart: "background:#0071ce;color:white;",
    Amazon: "background:#232f3e;color:white;",
    Target: "background:#cc0000;color:white;",
    Staples: "background:#444;color:white;"
  };
  return `
    <span style="
      ${styles[store]};
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
  const filtered = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(query)
  );

  res.send(`
    <div style="
      font-family:'Segoe UI', Arial, sans-serif;
      background:
        repeating-linear-gradient(
          to bottom,
          #f9fbf8,
          #f9fbf8 28px,
          #e6ece6 29px
        );
      padding:70px 40px;
      min-height:100vh;
      position:relative;
      overflow:hidden;
    ">

      <!-- DECORATIVE SCHOOL EMOJIS -->
      <div style="position:absolute;top:30px;left:30px;font-size:46px;opacity:.12;">✏️</div>
      <div style="position:absolute;top:140px;right:60px;font-size:42px;opacity:.12;">📚</div>
      <div style="position:absolute;bottom:90px;left:70px;font-size:44px;opacity:.12;">📎</div>
      <div style="position:absolute;bottom:50px;right:90px;font-size:46px;opacity:.12;">🍎</div>

      <!-- HERO -->
      <div style="text-align:center;margin-bottom:60px;">
        <h1 style="color:#2f4f4f;font-size:42px;margin-bottom:10px;">
          ✏️ Chalk & Save
        </h1>

        <div style="
          display:inline-block;
          background:#f4f0e6;
          color:#5a4a2f;
          padding:8px 18px;
          border-radius:20px;
          font-size:15px;
          font-weight:600;
          margin-bottom:22px;
        ">
          Teacher-tested. Budget-approved.
        </div>

        <p style="color:#5f7777;font-size:20px;max-width:640px;margin:22px auto 34px;">
          A beautiful, stress-free way to find the best classroom supply deals.
        </p>

        <form>
          <input
            type="text"
            name="q"
            value="${query}"
            placeholder="Search borders, markers, storage, prizes…"
            style="
              width:340px;
              padding:16px 20px;
              border-radius:30px;
              border:1px solid #ccc;
              font-size:16px;
            "
          />
          <button
            type="submit"
            style="
              margin-left:10px;
              padding:16px 26px;
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
      <div style="text-align:center;">
        ${filtered.map(p => `
          <div style="
            display:inline-block;
            width:280px;
            margin:18px;
            padding:26px;
            background:white;
            border-radius:22px;
            box-shadow:0 14px 34px rgba(0,0,0,.1);
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

            <div style="margin-bottom:16px;">
              ${storeBadge(p.store)}
            </div>

            <div style="font-size:17px;font-weight:600;color:#2f3e3e;margin-bottom:16px;">
              ${p.title}
            </div>

            <div style="font-size:30px;font-weight:bold;color:#2e7d32;margin-bottom:20px;">
              ${p.price}
            </div>

            <a
              href="${p.link}"
              target="_blank"
              style="
                display:block;
                text-align:center;
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
    </div>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
