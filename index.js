const express = require("express");

const app = express();

const PRODUCTS = [
  { title: "No. 2 Pencils (12 pack)", price: "$3.26", store: "Walmart" },
  { title: "No. 2 Pencils (12 pack)", price: "$3.51", store: "Amazon" },
  { title: "Crayons (24 pack)", price: "$4.19", store: "Target" },
  { title: "Dry Erase Markers (4 pack)", price: "$6.99", store: "Staples" },
  { title: "Glue Sticks (12 pack)", price: "$5.49", store: "Amazon" }
];

app.get("/", (req, res) => {
  res.send(`
    <h1 style="font-family: Arial; margin: 20px;">🍎 Teacher Deals</h1>
    <div style="display: inline-block; margin: 20px;">

      ${PRODUCTS.map(p => `
        <div style="
          display: inline-block;
          width: 250px;
          margin: 10px;
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,.1);
          font-family: Arial;
          vertical-align: top;
        ">
          <strong>${p.title}</strong><br><br>
          <span style="color: green; font-weight: bold;">${p.price}</span><br>
          <span style="color: #666;">${p.store}</span>
        </div>
      `).join("")}

    </div>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
