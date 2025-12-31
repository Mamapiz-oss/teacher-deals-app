const express = require("express");
const app = express();

const PRODUCTS = [
  {
    title: "No. 2 Pencils (12 pack)",
    price: "$3.26",
    store: "Walmart",
    featured: true,
    link: "https://www.walmart.com"
  },
  {
    title: "No. 2 Pencils (12 pack)",
    price: "$3.51",
    store: "Amazon",
    featured: false,
    link: "https://www.amazon.com"
  },
  {
    title: "Crayons (24 pack)",
    price: "$4.19",
    store: "Target",
    featured: true,
    link: "https://www.target.com"
  },
  {
    title: "Dry Erase Markers (4 pack)",
    price: "$6.99",
    store: "Staples",
    featured: false,
    link: "https://www.staples.com"
  },
  {
    title: "Glue Sticks (12 pack)",
    price: "$5.49",
    store: "Amazon",
    featured: false,
    link: "https://www.amazon.com"
  }
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
  res.send(`
    <div style="
      font-family: 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(180deg,#f7f9f6,#eef2ee);
      padding:40px;
      min-height:100vh;
    ">

      <h1 style="text-align:center;color:#2f4f4f;font-size:34px;">
        🍎 Teacher Deals
      </h1>

      <p style="text-align:center;color:#556b6b;font-size:18px;margin-bottom:30px;">
        Beautiful finds. Smart prices. Made for teachers.
      </p>

      <div style="text-align:center;">
        ${PRODUCTS.map(p => `
          <div style="
            display:inline-block;
            width:270px;
            margin:16px;
            padding:22px;
            background:white;
            border-radius:18px;
            box-shadow:0 10px 25px rgba(0,0,0,.08);
            vertical-align:top;
            position:relative;
          ">

            ${p.featured ? `
              <div style="
                position:absolute;
                top:14px;
                right:14px;
                background:#f4c430;
                color:#5a4600;
                font-size:12px;
                font-weight:bold;
                padding:6px 10px;
                border-radius:20px;
              ">
                ⭐ Teacher Pick
              </div>
            ` : ""}

            <div style="margin-bottom:14px;">
              ${storeBadge(p.store)}
            </div>

            <div style="font-size:16px;font-weight:600;color:#2f3e3e;margin-bottom:12px;">
              ${p.title}
            </div>

            <div style="font-size:26px;font-weight:bold;color:#2e7d32;margin-bottom:16px;">
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
                padding:12px;
                border-radius:10px;
                font-size:14px;
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
