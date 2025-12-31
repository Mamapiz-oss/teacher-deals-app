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
  const query = (req.query.q || "").toLowerCase();
  const filtered = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(query)
  );

  res.send(`
    <div style="
      font-family: 'Segoe UI', Arial, sans-serif;
      background:
        url('https://cdn-icons-png.flaticon.com/512/2942/2942563.png') no-repeat top 40px left 40px,
        url('https://cdn-icons-png.flaticon.com/512/2942/2942581.png') no-repeat top 80px right 60px,
        linear-gradient(180deg,#f8faf7,#eef3ef);
      background-size: 120px, 100px, cover;
      padding: 60px 40px;
      min-height: 100vh;
    ">

      <!-- HERO -->
      <div style="
        text-align:center;
        margin-bottom:60px;
      ">
        <h1 style="
          color:#2f4f4f;
          font-size:38px;
          margin-bottom:10px;
        ">
          🍎 Teacher Deals
        </h1>

        <p style="
          color:#5f7777;
          font-size:20px;
          max-width:600px;
          margin:0 auto 30px;
        ">
          The prettiest way to find the best classroom supply deals — made just for teachers.
        </p>

        <form>
          <input
            type="text"
            name="q"
            value="${query}"
            placeholder="Search pencils, crayons, markers…"
            style="
              width:340px;
              padding:16px 20px;
              border-radius:30px;
              border:1px solid #ccc;
              font-size:16px;
              outline:none;
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
            padding:24px;
            background:white;
            border-radius:20px;
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

            <div style="
              font-size:17px;
              font-weight:600;
              color:#2f3e3e;
              margin-bottom:14px;
            ">
              ${p.title}
            </div>

            <div style="
              font-size:28px;
              font-weight:bold;
              color:#2e7d32;
              margin-bottom:18px;
            ">
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
                border-radius:12px;
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
