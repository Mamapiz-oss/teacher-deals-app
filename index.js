const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const AMAZON_TAG = "mywebsit0e2ff-20";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "chalkandsave-secret",
    resave: false,
    saveUninitialized: false
  })
);

/* =========================
   USERS (PHASE 1 – MEMORY)
   ========================= */
// USERS[email] = { password, favorites: [] }
const USERS = {};

/* =========================
   PRODUCTS (MASTER LIST)
   ========================= */

const PRODUCTS = [

  // ===== DAILY INSTRUCTION =====
  {
    id:"dry-erase-markers",
    title:"Dry-Erase Markers (Assorted Colors)",
    category:"Daily Instruction & Teaching Tools",
    grade:"All",
    season:"All",
    price:"Typically $10–$18",
    store:"Amazon",
    icon:"✏️",
    link:`https://www.amazon.com/s?k=dry+erase+markers+classroom&tag=${AMAZON_TAG}`
  },
  {
    id:"highlighters",
    title:"Highlighters (Multi-Color Packs)",
    category:"Daily Instruction & Teaching Tools",
    grade:"All",
    season:"All",
    price:"Typically $6–$15",
    store:"Amazon",
    icon:"🖍️",
    link:`https://www.amazon.com/s?k=highlighters+classroom&tag=${AMAZON_TAG}`
  },
  {
    id:"sticky-notes",
    title:"Sticky Notes (Various Sizes)",
    category:"Daily Instruction & Teaching Tools",
    grade:"All",
    season:"All",
    price:"Typically $8–$20",
    store:"Amazon",
    icon:"🗒️",
    link:`https://www.amazon.com/s?k=sticky+notes+teacher&tag=${AMAZON_TAG}`
  },
  {
    id:"sentence-strips",
    title:"Sentence Strips",
    category:"Daily Instruction & Teaching Tools",
    grade:"K–5",
    season:"All",
    price:"Typically $5–$12",
    store:"Amazon",
    icon:"📏",
    link:`https://www.amazon.com/s?k=sentence+strips+classroom&tag=${AMAZON_TAG}`
  },
  {
    id:"pocket-charts",
    title:"Pocket Charts",
    category:"Daily Instruction & Teaching Tools",
    grade:"K–5",
    season:"All",
    price:"Typically $15–$30",
    store:"Amazon",
    icon:"📊",
    link:`https://www.amazon.com/s?k=pocket+chart+classroom&tag=${AMAZON_TAG}`
  },

  // ===== ORGANIZATION =====
  {
    id:"desk-organizer",
    title:"Teacher Desk Organizer",
    category:"Organization & Management",
    grade:"All",
    season:"Back to School",
    price:"Typically $15–$35",
    store:"Amazon",
    icon:"🗂️",
    link:`https://www.amazon.com/s?k=teacher+desk+organizer&tag=${AMAZON_TAG}`
  },
  {
    id:"file-folders",
    title:"File Folders (Assorted Colors)",
    category:"Organization & Management",
    grade:"All",
    season:"All",
    price:"Typically $10–$25",
    store:"Amazon",
    icon:"📁",
    link:`https://www.amazon.com/s?k=file+folders+teacher&tag=${AMAZON_TAG}`
  },
  {
    id:"label-maker",
    title:"Label Maker + Refill Labels",
    category:"Organization & Management",
    grade:"All",
    season:"Back to School",
    price:"Typically $20–$40",
    store:"Amazon",
    icon:"🏷️",
    link:`https://www.amazon.com/s?k=label+maker+classroom&tag=${AMAZON_TAG}`
  },

  // ===== PAPER & PRINTING =====
  {
    id:"copy-paper",
    title:"Copy Paper (Bulk)",
    category:"Paper & Printing",
    grade:"All",
    season:"All",
    price:"Typically $25–$45",
    store:"Staples",
    icon:"📄",
    link:"https://www.staples.com/copy-paper/cat_CL1408"
  },
  {
    id:"cardstock",
    title:"Cardstock (White & Colors)",
    category:"Paper & Printing",
    grade:"All",
    season:"All",
    price:"Typically $10–$25",
    store:"Amazon",
    icon:"📘",
    link:`https://www.amazon.com/s?k=cardstock+paper&tag=${AMAZON_TAG}`
  },
  {
    id:"construction-paper",
    title:"Construction Paper (Bulk Packs)",
    category:"Paper & Printing",
    grade:"All",
    season:"All",
    price:"Typically $12–$30",
    store:"Amazon",
    icon:"📗",
    link:`https://www.amazon.com/s?k=construction+paper+classroom&tag=${AMAZON_TAG}`
  },

  // ===== CRAFTS =====
  {
    id:"glue-sticks",
    title:"Glue Sticks (Classroom Pack)",
    category:"Cutting & Craft Supplies",
    grade:"All",
    season:"All",
    price:"Typically $8–$20",
    store:"Amazon",
    icon:"🧴",
    link:`https://www.amazon.com/s?k=glue+sticks+classroom&tag=${AMAZON_TAG}`
  },
  {
    id:"scissors",
    title:"Scissors (Student Safe & Adult)",
    category:"Cutting & Craft Supplies",
    grade:"All",
    season:"All",
    price:"Typically $6–$18",
    store:"Amazon",
    icon:"✂️",
    link:`https://www.amazon.com/s?k=scissors+classroom&tag=${AMAZON_TAG}`
  },

  // ===== DISPLAY =====
  {
    id:"bulletin-borders",
    title:"Bulletin Board Borders",
    category:"Display & Decoration",
    grade:"All",
    season:"All",
    price:"Typically $6–$15",
    store:"Amazon",
    icon:"📌",
    link:`https://www.amazon.com/s?k=bulletin+board+borders&tag=${AMAZON_TAG}`
  },

  // ===== CLEANLINESS =====
  {
    id:"disinfecting-wipes",
    title:"Disinfecting Wipes",
    category:"Classroom Cleanliness",
    grade:"All",
    season:"Cold & Flu",
    price:"Typically $10–$25",
    store:"Amazon",
    icon:"🧼",
    link:`https://www.amazon.com/s?k=disinfecting+wipes&tag=${AMAZON_TAG}`
  }

];

/* =========================
   HELPERS
   ========================= */

function requireLogin(req, res, next) {
  if (!req.session.userEmail || !USERS[req.session.userEmail]) {
    return res.redirect("/login");
  }
  next();
}

function unique(field) {
  return [...new Set(PRODUCTS.map(p => p[field]))];
}

function storeBadge(store) {
  const map = {
    Amazon:["🛒","#232f3e"],
    Target:["🎯","#cc0000"],
    Staples:["📎","#444"]
  };
  const [icon,color] = map[store];
  return `<span style="background:${color};color:white;padding:6px 14px;border-radius:16px;font-size:13px;font-weight:600;">${icon} ${store}</span>`;
}

/* =========================
   ROUTES
   ========================= */

app.get("/", (req, res) => {
  if (req.session.userEmail) return res.redirect("/shop");
  res.send(`<h1 style="text-align:center;">✏️ Chalk & Save</h1><p style="text-align:center;"><a href="/login">Sign in</a></p>`);
});

app.get("/login", (req, res) => {
  res.send(`
    <form method="POST" style="text-align:center;">
      <h2>Sign In</h2>
      <input name="email" placeholder="Email" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button>Sign In</button>
      <p><a href="/signup">Create account</a></p>
    </form>
  `);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!USERS[email] || USERS[email].password !== password) return res.redirect("/login");
  req.session.userEmail = email;
  res.redirect("/shop");
});

app.get("/signup", (req, res) => {
  res.send(`
    <form method="POST" style="text-align:center;">
      <h2>Create Account</h2>
      <input name="email" placeholder="Email" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button>Create</button>
    </form>
  `);
});

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  USERS[email] = { password, favorites: [] };
  req.session.userEmail = email;
  res.redirect("/shop");
});

app.post("/favorite/:id", requireLogin, (req, res) => {
  const user = USERS[req.session.userEmail];
  if (!user.favorites.includes(req.params.id)) user.favorites.push(req.params.id);
  res.redirect("/shop");
});

app.get("/shop", requireLogin, (req, res) => {
  const user = USERS[req.session.userEmail];
  const q = (req.query.q || "").toLowerCase();
  const category = req.query.category || "";

  const filtered = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(q) &&
    (!category || p.category === category)
  );

  res.send(`
    <form style="text-align:center;">
      <input name="q" placeholder="Search supplies…" value="${q}">
      <select name="category">
        <option value="">All Categories</option>
        ${unique("category").map(c => `<option ${c===category?"selected":""}>${c}</option>`).join("")}
      </select>
      <button>Search</button>
    </form>

    <div style="text-align:center;">
      ${filtered.map(p => `
        <div style="display:inline-block;width:260px;margin:16px;padding:20px;border-radius:22px;background:white;box-shadow:0 12px 30px rgba(0,0,0,.1);">
          <div style="font-size:42px;">${p.icon}</div>
          ${storeBadge(p.store)}
          <h3>${p.title}</h3>
          <p>${p.price}</p>
          <form method="POST" action="/favorite/${p.id}">
            <button>⭐ Save</button>
          </form>
          <a href="${p.link}" target="_blank">View Options →</a>
        </div>
      `).join("")}
    </div>
  `);
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

/* =========================
   SERVER
   ========================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT);
