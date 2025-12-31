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
  const query = (req.query.q || "").toLowerCase();
  const filtered = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(query)
  );

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
        margin-bottom: 8px;
      ">
        🍎 Teacher Deals
      </h1>

      <p style="
        text-align: center;
        color: #556b6b;
        margin-bottom: 28px;
        font-size: 18px;
      ">
        Beautiful finds. Smart prices. Made for teachers.
      </p>

      <!-- FANCY SEARCH BAR -->
      <form style="text-align:center; margin-bottom: 40px;">
        <input
          type="text"
          name="q"
          placeholder="Search classroom supplies…"
          value="${query}"
          style="
            width: 320px;
            padding: 14px 18px;
            border-radius: 30px;
            border: 1px solid #ccc;
            font-size: 16px;
            outline: none;
          "
        />
        <button
          type="submit"
          style="
            margin-left: 10px;
            padding: 14px 22px;
            border-radius: 30px;
            border: none;
            background: #2f4f4f;
            color: white;
            font-size: 16px;
            cursor: pointer;
          "
        >
          Search
        </button>
      </form>

      <div style="text-align:center;">

        ${filtered.length === 0 ? `
          <p style="color:#777;">No results found.</p>
        ` : ""}

        ${filtered.map(p => `
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
          ">

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
