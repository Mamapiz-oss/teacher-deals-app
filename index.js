const express = require("express");
const app = express();

const PRODUCTS = [
  { title: "No. 2 Pencils (12 pack)", price: "$3.26", store: "Walmart", featured: true },
  { title: "No. 2 Pencils (12 pack)", price: "$3.51", store: "Amazon", featured: false },
  { title: "Crayons (24 pack)", price: "$4.19", store: "Target", featured: true },
  { title: "Dry Erase Markers (4 pack)", price: "$6.99", store: "Staples", featured: false },
  { title: "Glue Sticks (12 pack)", price: "$5.49", store: "Amazon", featured: false }
];

app.get("/", (req, res) => {
  res.send(`
    <div style="
      font-family: 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(180deg, #f7f9f6, #eef2ee);
      padding: 40px;
      min-height: 100vh;
    ">

      <h1 style="
        text-align: center;
        color: #2f4f4f;
        font-size: 34px;
        margin-bottom: 10px;
      ">
        🍎 Teacher Deals
      </h1>

      <p style="
        text-align: center;
        color: #556b6b;
        margin-bottom: 40px;
        font-size: 18px;
      ">
        Beautiful finds. Smart prices. Made for teachers.
      </p>

      <div style="text-align:center;">

        ${PRODUCTS.map(p => `
          <div style="
            display: inline-block;
            width: 260px;
            margin: 16px;
            padding: 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,.08);
            position: relative;
            vertical-align: top;
            transition: transform .2s, box-shadow .2s;
          "
          onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 14px 30px rgba(0,0,0,.12)'"
          onmouseout="this.style.transform='none';this.style.boxShadow='0 10px 25px rgba(0,0,0,.08)'"
          >

            ${p.featured ? `
              <div style="
                position: absolute;
                top: 14px;
                right: 14px;
                background: #f4c430;
                color: #5a4600;
                font-size: 12px;
                font-weight: bold;
                padding: 6px 10px;
                border-radius: 20px;
              ">
                ⭐ Teacher Pick
              </div>
            ` : ""}

            <div style="
              font-size: 16px;
              font-weight: 600;
              color: #2f3e3e;
              margin-bottom: 14px;
            ">
              ${p.title}
            </div>

            <div style="
              font-size: 26px;
              font-weight: bold;
              color: #2e7d32;
              margin-bottom: 6px;
            ">
              ${p.price}
            </div>

            <div style="
              font-size: 14px;
              color: #6b6b6b;
              margin-bottom: 16px;
            ">
              ${p.store}
            </div>

            <div style="
              text-align: center;
              background: #2f4f4f;
              color: white;
              padding: 10px;
              border-radius: 10px;
              font-size: 14px;
              cursor: pointer;
            ">
              View Deal →
            </div>

          </div>
        `).join("")}

      </div>
    </div>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);

