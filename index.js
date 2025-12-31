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
            font-family: Arial, sans-serif;
            background: #f6f7f5;
            padding: 40px;
          }
          h1 {
            color: #2f4f4f;
          }
          input {
            padding: 10px;
            width: 260px;
            font-size: 16px;
            border-radius: 6px;
            border: 1px solid #ccc;
          }
          button {
            padding: 10px 14px;
            margin-left: 6px;
            font-size: 16px;
            border-radius: 6px;
            border: none;
            background: #2f4f4f;
            color: white;
            cursor: pointer;
          }
          .card {
            background: white;
            padding: 16px;
            margin: 12px 0;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0,0,0,.08);
          }
          .price {
            color: #2e7d32;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>🍎 Teacher Deals</h1>
        <p>Find the best classroom supply prices.</p>

        <form>
          <input type="text" name="q" placeholder="Search supplies..." />
          <button type="submit">Search</button>
        </form>

        ${filtered.length === 0 ? "<p>No results found.</p>" : ""}

        ${filtered.map(p => `
          <div class="card">
            <strong>${p.title}</strong><br>
            <span class="price">${p.price}</span> — ${p.store}
          </div>
        `).join("")}
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
