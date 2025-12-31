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
   USERS (IN MEMORY – PHASE 1)
   ========================= */
// USERS[email] = { password, favorites: [] }
const USERS = {};

/* =========================
   PRODUCT DATA
   ========================= */

const PRODUCTS = [
  { id:"markers", title:"Dry-Erase Markers", category:"Daily Instruction", grade:"All", season:"All", price:"Often $10–$18", store:"Amazon", icon:"✏️", link:`https://www.amazon.com/s?k=dry+erase+markers+classroom&tag=${AMAZON_TAG}` },
  { id:"charts", title:"Pocket Charts", category:"Daily Instruction", grade:"K–5", season:"All", price:"Often $15–$30", store:"Amazon", icon:"📊", link:`https://www.amazon.com/s?k=pocket+chart+classroom&tag=${AMAZON_TAG}` },
  { id:"desk", title:"Teacher Desk Organizer", category:"Organization", grade:"All", season:"Back to School", price:"Often $15–$35", store:"Amazon", icon:"🗂️", link:`https://www.amazon.com/s?k=teacher+desk+organizer&tag=${AMAZON_TAG}` },
  { id:"binders", title:"Binders (1–3 inch)", category:"Organization", grade:"All", season:"All", price:"Typically $12–$30", store:"Target", icon:"📁", link:"https://www.target.com/s?searchTerm=school+binders" },
  { id:"paper", title:"Copy Paper (Bulk)", category:"Paper & Printing", grade:"All", season:"All", price:"Often $25–$45", store:"Staples", icon:"📄", link:"https://www.staples.com/copy-paper/cat_CL1408" },
  { id:"laminate", title:"Laminating Sheets", category:"Paper & Printing", grade:"All", season:"Back to School", price:"Often $15–$30", store:"Amazon", icon:"🖨️", link:`https://www.amazon.com/s?k=laminating+sheets+teacher&tag=${AMAZON_TAG}` }
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
    Amazon: ["🛒", "#232f3e"],
    Target: ["🎯", "#cc0000"],
    Staples: ["📎", "#444"]
  };
  const [icon, color] = map[store];
  return `<span style="background:${color};color:white;padding:6px 14px;border-radius:16px;font-size:13px;font-weight:600;">${icon} ${store}</span>`;
}

function unique(field) {
  return [...new Set(PRODUCTS.map(p => p[field]))];
}

/* =========================
   WELCOME PAGE
   ========================= */

app.get("/", (req, res) => {
 if (req.session.userEmail) return res.redirect("/shop");

res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Chalk & Save</title>

<style>
body {
  margin: 0;
  font-family: "Segoe UI", Arial, sans-serif;
  background: #f6f8f4;
}

.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 50px;
  max-width: 1200px;
  margin: 80px auto 40px;
  padding: 40px;
  align-items: center;
}

.hero h1 {
  font-size: 52px;
  margin: 0 0 20px;
}

.hero p {
  font-size: 20px;
  color: #444;
  margin-bottom: 30px;
  line-height: 1.4;
}

.cta {
  display: inline-block;
  background: #2f4f4f;
  color: white;
  padding: 16px 36px;
  border-radius: 28px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
}

.hero img {
  width: 100%;
  border-radius: 28px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
}

/* CATEGORY PREVIEW */
.categories {
  max-width: 1100px;
  margin: 40px auto 80px;
  padding: 0 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 28px;
}

.category-card {
  background: white;
  border-radius: 22px;
  padding: 26px 20px;
  text-align: center;
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

.category-card span {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}

.category-card h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

/* mobile */
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>
</head>

<body>

<!-- HERO -->
<div class="hero">
  <div>
    <h1>✏️ Chalk & Save</h1>
    <p>
      A smarter way for teachers to shop classroom supplies.<br>
      Compare trusted stores, save favorites, and stop overspending.
    </p>
    <a class="cta" href="/login">Sign in to start saving →</a>
  </div>

  <div>
    <img src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b" alt="Teacher desk with school supplies">
  </div>
</div>

<!-- CATEGORY PREVIEW -->
<div class="categories">
  <div class="category-card"><span>✏️</span><h3>Daily Instruction</h3></div>
  <div class="category-card"><span>🗂️</span><h3>Organization</h3></div>
  <div class="category-card"><span>📄</span><h3>Paper & Printing</h3></div>
  <div class="category-card"><span>✂️</span><h3>Crafts & Supplies</h3></div>
  <div class="category-card"><span>📌</span><h3>Display & Decor</h3></div>
  <div class="category-card"><span>🖥️</span><h3>Classroom Tools</h3></div>
</div>

</body>
</html>
`);

res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Chalk & Save</title>

<style>
body {
  margin: 0;
  font-family: "Segoe UI", Arial, sans-serif;
  background: #f6f8f4;
}

.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  max-width: 1200px;
  margin: 80px auto;
  padding: 40px;
  align-items: center;
}

.hero h1 {
  font-size: 52px;
  margin: 0 0 20px;
}

.hero p {
  font-size: 20px;
  color: #444;
  margin-bottom: 30px;
  line-height: 1.4;
}

.cta {
  display: inline-block;
  background: #2f4f4f;
  color: white;
  padding: 16px 36px;
  border-radius: 28px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
}

.hero img {
  width: 100%;
  border-radius: 28px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
}

/* mobile */
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>
</head>

<body>

<div class="hero">
  <div>
    <h1>✏️ Chalk & Save</h1>
    <p>
      A smarter way for teachers to shop classroom supplies.<br>
      Compare trusted stores, save your favorites, and stop overspending.
    </p>
    <a class="cta" href="/login">Sign in to start saving →</a>
  </div>

  <div>
    <img src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b" alt="Teacher desk with school supplies">
  </div>
</div>

</body>
</html>
`);

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Chalk & Save</title>
<style>
body {
  margin:0;
  font-family:Segoe UI, Arial;
  background:#f6f8f4;
  cursor:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text x='0' y='24' font-size='24'>✏️</text></svg>") 0 24, auto;
}
.hero {
  background:url('https://images.unsplash.com/photo-1588072432836-e10032774350');
  background-size:cover;
  background-position:center;
  padding:120px 20px;
  text-align:center;
  color:white;
}
.hero-box {
  background:rgba(0,0,0,.45);
  padding:50px 60px;
  border-radius:28px;
  display:inline-block;
}
.button {
  background:#2f4f4f;
  color:white;
  padding:14px 30px;
  border-radius:28px;
  font-size:16px;
  font-weight:600;
  text-decoration:none;
}
</style>
</head>
<body>
  <div class="hero">
    <div class="hero-box">
      <h1 style="font-size:52px;">✏️ Chalk & Save</h1>
      <p style="font-size:22px;">A calm, beautiful place for teachers to shop smarter.</p>
      <a class="button" href="/login">Sign in to start shopping →</a>
    </div>
  </div>
</body>
</html>
`);
});

/* =========================
   AUTH
   ========================= */

app.get("/login", (req, res) => {
  res.send(`
<body style="font-family:Segoe UI;background:#f6f8f4;display:flex;justify-content:center;align-items:center;height:100vh;">
<div style="background:white;padding:40px;border-radius:24px;width:360px;text-align:center;">
<h2>Sign In</h2>
<form method="POST">
<input name="email" placeholder="Email" required style="width:100%;padding:12px;margin:6px 0;">
<input type="password" name="password" placeholder="Password" required style="width:100%;padding:12px;margin:6px 0;">
<button style="width:100%;padding:12px;background:#2f4f4f;color:white;border-radius:18px;">Sign In</button>
</form>
<p><a href="/signup">Create an account</a></p>
</div>
</body>
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
<body style="font-family:Segoe UI;background:#f6f8f4;display:flex;justify-content:center;align-items:center;height:100vh;">
<div style="background:white;padding:40px;border-radius:24px;width:360px;text-align:center;">
<h2>Create Account</h2>
<form method="POST">
<input name="email" placeholder="Email" required style="width:100%;padding:12px;margin:6px 0;">
<input type="password" name="password" placeholder="Password" required style="width:100%;padding:12px;margin:6px 0;">
<button style="width:100%;padding:12px;background:#2f4f4f;color:white;border-radius:18px;">Create Account</button>
</form>
</div>
</body>
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

app.get("/favorites", requireLogin, (req, res) => {
  const user = USERS[req.session.userEmail];
  const favs = PRODUCTS.filter(p => user.favorites.includes(p.id));

  res.send(`
<h1 style="text-align:center;">❤️ My Favorites</h1>
<div style="max-width:1000px;margin:40px auto;text-align:center;">
${favs.map(p => `<p>${p.title}</p>`).join("")}
<p><a href="/shop">← Back to shop</a></p>
</div>
`);
});

/* =========================
   SHOP (COHESIVE UI)
   ========================= */

app.get("/shop", requireLogin, (req, res) => {
  const user = USERS[req.session.userEmail];
  const q = (req.query.q || "").toLowerCase();
  const category = req.query.category || "";
  const grade = req.query.grade || "";
  const season = req.query.season || "";

  const filtered = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(q) &&
    (!category || p.category === category) &&
    (!grade || p.grade === grade || p.grade === "All") &&
    (!season || p.season === season || p.season === "All")
  );

  res.send(`
<!DOCTYPE html>
<html>
<head><title>Shop | Chalk & Save</title></head>
<body style="font-family:Segoe UI,Arial;background:#f6f8f4;margin:0;">

<!-- BANNER -->
<div style="background:url('https://images.unsplash.com/photo-1588072432836-e10032774350');
background-size:cover;background-position:center;padding:70px 20px;color:white;">
<div style="max-width:1200px;margin:0 auto;
background:rgba(0,0,0,.45);padding:28px 36px;border-radius:24px;
display:flex;justify-content:space-between;align-items:center;">
<div>
<h1 style="margin:0;font-size:34px;">✏️ Chalk & Save</h1>
<p style="margin:6px 0 0;">Welcome back — happy shopping.</p>
</div>
<div>
<a href="/favorites" style="color:white;margin-right:16px;">❤️ My Favorites (${user.favorites.length})</a>
<a href="/logout" style="background:#2f4f4f;color:white;padding:10px 18px;border-radius:18px;text-decoration:none;">Log out</a>
</div>
</div>
</div>

<!-- FILTERS -->
<form style="text-align:center;padding:30px;background:#eef1ec;">
<input name="q" placeholder="Search supplies…" value="${q}" />
<select name="category"><option value="">Category</option>${unique("category").map(c=>`<option ${c===category?"selected":""}>${c}</option>`).join("")}</select>
<select name="grade"><option value="">Grade</option>${unique("grade").map(g=>`<option ${g===grade?"selected":""}>${g}</option>`).join("")}</select>
<select name="season"><option value="">Season</option>${unique("season").map(s=>`<option ${s===season?"selected":""}>${s}</option>`).join("")}</select>
<button>Browse</button>
</form>

<!-- CARDS -->
<div style="max-width:1200px;margin:40px auto;text-align:center;">
${filtered.map(p=>`
<div style="display:inline-block;width:260px;margin:16px;padding:24px;background:white;border-radius:22px;box-shadow:0 14px 35px rgba(0,0,0,.08);">
<div style="font-size:48px;">${p.icon}</div>
${storeBadge(p.store)}
<h3>${p.title}</h3>
<div>${p.price}</div>
<form method="POST" action="/favorite/${p.id}">
<button style="margin-top:6px;">⭐ Save</button>
</form>
<a href="${p.link}" target="_blank">View Options →</a>
</div>
`).join("")}
</div>

</body>
</html>
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
