const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PRODUCTS = [
  { title: "No. 2 Pencils (12 pack)", price: "$3.26", store: "Walmart" },
  { title: "No. 2 Pencils (12 pack)", price: "$3.51", store: "Amazon" },
  { title: "Crayons (24 pack)", price: "$4.19", store: "Target" },
  { title: "Dry Erase Markers (4 pack)", price: "$6.99", store: "Staples" },
  { title: "Glue Sticks (12 pack)", price: "$5.49", store: "Amazon" }
];

app.get("/", (req, res) => {
  const query = (req.query.q || "").toLowerCase();
  const filtered = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(query)
  );

  res.send(`
  <html>
    <head>
      <title>Teacher Deals</title>
      <style>
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #f4f6f3;
          color: #2f3e3e;
        }
        header {
          background: #ffffff;
          padding: 20px 40px;
          box-shadow: 0 2px 6px rgba(0,0,0,.06);
        }
        h1 {
          margin: 0;
          font-size: 28px;
        }
        .container {
          max-width: 900px;
          margin: 30px auto;
          padding: 0 20px;
        }
        .search {
          margin-bottom: 30px;
        }
        input {
          padding: 12px;
          width: 260px;
          font-size: 16px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
        button {
          padding: 12px 18px;
          margin-left: 8px;
          font-size: 16px;
          border-radius: 8px;
          border: none;
          background: #2f4f4f;
          color: white;
          cursor: pointer;
       .grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}


        .card {
          background: white;
          padding: 20px;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,.08);
        }
        .price {
          color: #2e7d32;
          font-weight: bold;
          font-size: 18px;
        }
        .store {
          font-size: 14px;
          color: #6b6b6b;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>🍎 Teacher Deals</h1>
      </header>

      <div class="container">
        <p>Find the best classroom supply prices across stores.</p>

        <form class="search">
          <input type="text" name="q" placeholder="Search supplies…" />
          <button type="submit">Search</button>
        </form>

        <div class="grid">
          ${filtered.map(p => `
            <div class="card">
              <strong>${p.title}</strong><br><br>
              <span class="price">${p.price}</span><br>
              <span class="store">${p.store}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </body>
  </html>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
