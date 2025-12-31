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
   USERS (IN MEMORY)
   ========================= */
// USERS[email] = { password: "123", favorites: [] }
const USERS = {};

/* =========================
   PRODUCTS
   ========================= */

const PRODUCTS = [
  { id:"markers", title:"Dry-Erase Markers", price:"Often $10–$18", store:"Amazon", icon:"✏️", link:`https://www.amazon.com/s?k=dry+erase+markers+classroom&tag=${AMAZON_TAG}` },
  { id:"charts", title:"Pocket Charts", price:"Often $15–$30", store:"Amazon", icon:"📊", link:`https://www.amazon.com/s?k=pocket+chart+classroom&tag=${AMAZON_TAG}` },
  { id:"desk", title:"Teacher Desk Organizer", price:"Often $15–$35", store:"Amazon", icon:"🗂️", link:`https://www.amazon.com/s?k=teacher+desk+organizer&tag=${AMAZON_TAG}` },
  { id:"binders", title:"Binders (1–3 inch)", price:"Typically $12–$30", store:"Target", icon:"📁", link:"https://www.target.com/s?searchTerm=school+binders" },
  { id:"paper", title:"Copy Paper (Bulk)", price:"Often $25–$45", store:"Staples", icon:"📄", link:"https://www.staples.com/copy-paper/cat_CL1408" },
  { id:"laminate", title:"Laminating Sheets", price:"Often $15–$30", store:"Amazon", icon:"🖨️", link:`https://www.amazon.com/s?k=laminating+sheets+teacher&tag=${AMAZON_TAG}` }
];

/* =========================
   HELPERS
   ========================= */

function storeBadge(store) {
  const colors = { Amazon:"#232f3e", Target:"#cc0000", Staples:"#444" };
  const icons = { Amazon:"🛒", Target:"🎯", Staples:"📎" };
  return `<span style="background:${colors[store]};color:white;padding:6px 14px;border-radius:16px;font-size:13px;">${icons[store]} ${store}</span>`;
}

function requireLogin(req, res, next) {
  if (!req.session.userEmail || !USERS[req.session.userEmail]) {
    return res.redirect("/login");
  }
  next();
}

/* =========================
   WELCOME
   ========================= */

app.get("/", (req, res) => {
  if (req.session.userEmail) return res.redirect("/shop");
  res.send(`
    <h1 style="text-align:center;">✏️ Chalk & Save</h1>
    <p style="text-align:center;"><a href="/login">Sign in</a></p>
  `);
});

/* =========================
   LOGIN
   ========================= */

app.get("/login", (req, res) => {
  res.send(`
    <h2 style="text-align:center;">Sign In</h2>
    <form method="POST" style="text-align:center;">
      <input name="email" placeholder="Email" required /><br/>
      <input type="password" name="password" placeholder="Password" required /><br/>
      <button>Sign In</button>
    </form>
    <p style="text-align:center;"><a href="/signup">Create account</a></p>
  `);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!USERS[email]) {
    return res.redirect("/signup");
  }

  if (USERS[email].password !== password) {
    return res.redirect("/login");
  }

  req.session.userEmail = email;
  res.redirect("/shop");
});

/* =========================
   SIGNUP
   ========================= */

app.get("/signup", (req, res) => {
  res.send(`
    <h2 style="text-align:center;">Create Account</h2>
    <form method="POST" style="text-align:center;">
      <input name="email" placeholder="Email" required /><br/>
      <input type="password" name="password" placeholder="Password" required /><br/>
      <button>Create Account</button>
    </form>
  `);
});

app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (!USERS[email]) {
    USERS[email] = { password, favorites: [] };
  }

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

/* =========================
   SHOP
   ========================= */

app.get("/shop", requireLogin, (req, res) => {
  const user = USERS[req.session.userEmail];

  res.send(`
    <h2 style="text-align:center;">Welcome back</h2>
    <p style="text-align:center;">
      ❤️ Favorites (${user.favorites.length}) |
      <a href="/logout">Log out</a>
    </p>

    <div style="text-align:center;">
      ${PRODUCTS.map(p => `
        <div style="display:inline-block;width:260px;margin:12px;padding:20px;border:1px solid #ddd;">
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

/* =========================
   LOGOUT
   ========================= */

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

/* =========================
   SERVER
   ========================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT);
