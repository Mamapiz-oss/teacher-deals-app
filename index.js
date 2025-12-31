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
   USERS (IN-MEMORY)
   ========================= */
const USERS = {}; 
// USERS[email] = { password, favorites: [] }

/* =========================
   PRODUCTS
   ========================= */

const PRODUCTS = [
  {
    id:"dry-erase-markers",
    title:"Dry-Erase Markers",
    category:"Daily Instruction",
    price:"$10–$18",
    store:"Amazon",
    icon:"✏️",
    link:`https://www.amazon.com/s?k=dry+erase+markers+classroom&tag=${AMAZON_TAG}`
  },
  {
    id:"sticky-notes",
    title:"Sticky Notes",
    category:"Daily Instruction",
    price:"$8–$20",
    store:"Amazon",
    icon:"🗒️",
    link:`https://www.amazon.com/s?k=sticky+notes+teacher&tag=${AMAZON_TAG}`
  },
  {
    id:"pocket-charts",
    title:"Pocket Charts",
    category:"Daily Instruction",
    price:"$15–$30",
    store:"Amazon",
    icon:"📊",
    link:`https://www.amazon.com/s?k=pocket+chart+classroom&tag=${AMAZON_TAG}`
  },
  {
    id:"desk-organizer",
    title:"Teacher Desk Organizer",
    category:"Organization",
    price:"$15–$35",
    store:"Amazon",
    icon:"🗂️",
    link:`https://www.amazon.com/s?k=teacher+desk+organizer&tag=${AMAZON_TAG}`
  },
  {
    id:"file-folders",
    title:"File Folders",
    category:"Organization",
    price:"$10–$25",
    store:"Amazon",
    icon:"📁",
    link:`https://www.amazon.com/s?k=file+folders+teacher&tag=${AMAZON_TAG}`
  },
  {
    id:"copy-paper",
    title:"Copy Paper (Bulk)",
    category:"Paper & Printing",
    price:"$25–$45",
    store:"Staples",
    icon:"📄",
    link:"https://www.staples.com/copy-paper/cat_CL1408"
  },
  {
    id:"construction-paper",
    title:"Construction Paper",
    category:"Paper & Printing",
    price:"$12–$30",
    store:"Amazon",
    icon:"📘",
    link:`https://www.amazon.com/s?k=construction+paper+classroom&tag=${AMAZON_TAG}`
  },
  {
    id:"glue-sticks",
    title:"Glue Sticks",
    category:"Craft Supplies",
    price:"$8–$20",
    store:"Amazon",
    icon:"🧴",
    link:`https://www.amazon.com/s?k=glue+sticks+classroom&tag=${AMAZON_TAG}`
  },
  {
    id:"scissors",
    title:"Scissors",
    category:"Craft Supplies",
    price:"$6–$18",
    store:"Amazon",
    icon:"✂️",
    link:`https://www.amazon.com/s?k=scissors+classroom&tag=${AMAZON_TAG}`
  },
  {
    id:"bulletin-borders",
    title:"Bulletin Board Borders",
    category:"Display & Decor",
    price:"$6–$15",
    store:"Amazon",
    icon:"📌",
    link:`https://www.amazon.com/s?k=bulletin+board+borders&tag=${AMAZON_TAG}`
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

function storeBadge(store) {
  const map = {
    Amazon:["🛒","#232f3e"],
    Staples:["📎","#444"]
  };
  const [icon,color] = map[store];
  return `<span style="background:${color};color:white;padding:6px 14px;border-radius:16px;font-size:13px;">${icon} ${store}</span>`;
}

function categories() {
  return [...new Set(PRODUCTS.map(p => p.category))];
}

/* =========================
   LANDING PAGE
   ========================= */

app.get("/", (req, res) => {
  if (req.session.userEmail) return res.redirect("/shop");
  res.send(`
    <div style="max-width:900px;margin:120px auto;text-align:center;font-family:Segoe UI;">
      <h1 style="font-size:48px;">✏️ Chalk & Save</h1>
      <p style="font-size:20px;color:#444;">
        A calm, teacher-focused way to find classroom supplies,<br>
        compare real stores, and save your favorites.
      </p>
      <a href="/login" style="display:inline-block;margin-top:30px;
        background:#2f4f4f;color:white;padding:16px 36px;
        border-radius:28px;font-size:18px;text-decoration:none;">
        Sign in to start →
      </a>
    </div>
  `);
});

/* =========================
   AUTH
   ========================= */

app.get("/login", (req, res) => {
  res.send(`
    <form method="POST" style="text-align:center;margin-top:120px;">
      <h2>Sign In</h2>
      <input name="email" placeholder="Email" required><br><br>
      <input type="password" name="password" placeholder="Password" required><br><br>
      <button>Sign In</button>
      <p><a href="/signup">Create account</a></p>
    </form>
  `);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!USERS[email] || USERS[email].password !== password) {
    return res.redirect("/login");
  }
  req.session.userEmail = email;
  res.redirect("/shop");
});

app.get("/signup", (req, res) => {
  res.send(`
    <form method="POST" style="text-align:center;margin-top:120px;">
      <h2>Create Account</h2>
      <input name="email" placeholder="Email" required><br><br>
      <input type="password" name="password" placeholder="Password" required><br><br>
      <button>Create Account</button>
    </form>
  `);
});

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  USERS[email] = { password, favorites: [] };
  req.session.userEmail = email;
  res.redirect("/shop");
});

/* =========================
   FAVORITES
   ========================= */

app.post("/favorite/:id", requireLogin, (req, res) => {
  const user = USERS[req.session.userEmail];
  if (!user.favorites.includes(req.params.id)) {
    user.favorites.push(req.params.id);
  }
  res.redirect("/shop");
});

app.get("/favorites", requireLogin, (req, res) => {
  const user = USERS[req.session.userEmail];
  const favs = PRODUCTS.filter(p => user.favorites.includes(p.id));
  res.send(`
    <h1 style="text-align:center;">❤️ My Favorites</h1>
    <div style="text-align:center;">
      ${favs.map(p => `<p>${p.title}</p>`).join("")}
      <p><a href="/shop">← Back to shop</a></p>
    </div>
  `);
});

/* =========================
   SHOP
   ========================= */

app.get("/shop", requireLogin, (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const category = req.query.category || "";

  const filtered = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(q) &&
    (!category || p.category === category)
  );

  res.send(`
    <form style="text-align:center;margin:40px;">
      <input name="q" placeholder="Search supplies…" value="${q}">
      <select name="category">
        <option value="">All Categories</option>
        ${categories().map(c => `<option ${c===category?"selected":""}>${c}</option>`).join("")}
      </select>
      <button>Search</button>
      <a href="/favorites" style="margin-left:20px;">❤️ Favorites</a>
      <a href="/logout" style="margin-left:20px;">Log out</a>
    </form>

    <div style="text-align:center;">
      ${filtered.map(p => `
        <div style="display:inline-block;width:260px;margin:16px;padding:20px;
          border-radius:22px;background:white;
          box-shadow:0 12px 30px rgba(0,0,0,.1);">
          <div style="font-size:40px;">${p.icon}</div>
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

