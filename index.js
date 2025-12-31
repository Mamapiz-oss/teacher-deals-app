const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PRODUCTS = [
  {
    id: "pencils-walmart",
    title: "No. 2 Pencils (12 pack)",
    price: 3.26,
    store: "Walmart",
    url: "https://www.walmart.com",
    image: "https://images.unsplash.com/photo-1519451111620-36d4948df991"
  },
  {
    id: "pencils-amazon",
    title: "No. 2 Pencils (12 pack)",
    price: 3.51,
    store: "Amazon",
    url: "https://www.amazon.com",
    image: "https://images.unsplash.com/photo-1519451111620-36d4948df991"
  }
];

app.get("/", (req, res) => {
  res.send("Teacher Deals App is running");
});

app.get("/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const results = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(q)
  );
  res.json(results);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`App running on port ${PORT}`)
);

