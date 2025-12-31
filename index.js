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
  res.send(`
  <html>
    <head>
      <title>Teacher Deals</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f4f6f3;
          color: #2f3e3e;
        }
        header {
          background: white;
          padding: 20px 40px;
          box-shadow: 0 2px 6px rgba(0,0,0,.08);
        }
        .container {
          max-width: 1000px;
          margin: 30px auto;
          padding: 0 20px;
        }
        .cards {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .card {
          background: white;
          border-radius: 14px;
          padding: 20px;
          width: 280px;
          box-shadow: 0 4px 12px rgba(0,0,0,.1);
        }
        .price {
          color: #2e7d32;
          font-weight: bold;
          font-size: 18px;
        }
        .store {
          color: #777;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>🍎 Teacher Deals</h1>
      </header>

      <div class="container">
        <p>Find the best classroom supply prices.</p>

        <div class="cards">
          ${PRODUCTS.map(p => `
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
