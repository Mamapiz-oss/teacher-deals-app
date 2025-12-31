const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const AMAZON_TAG = "mywebsit0e2ff-20";

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "chalkandsave-secret",
    resave: false,
    saveUninitialized: false
  })
);

/* =========================
   IN-MEMORY USERS (PHASE 1)
   ========================= */

const USERS = {}; // { email: password }

/* =========================
   PRODUCT DATA
   ========================= */

const PRODUCTS = [
  { title: "Dry-Erase Markers", category: "Daily Instruction", grades: "All", season: "All", price: "Often $10–$18", store: "Amazon", icon: "✏️", link: `https://www.amazon.com/s?k=dry+erase+markers+classroom&tag=${AMAZON_TAG}` },
  { title: "Pocket Charts", category: "Daily Instruction", grades: "K–5", season: "All", price: "Often $15–$30", store: "Amazon", icon: "📊", link: `https://www.amazon.com/s?k=pocket+chart+classroom&tag=${AMAZON_TAG}` },
  { title: "Teacher Desk Organizer", category: "Organization", grades: "All", season: "Back to School", price: "Often $15–$35", store: "Amazon", icon: "🗂️", link: `https://www.amazon.com/s?k=teacher+desk+organizer&tag=${AMAZON_TAG}` },
  { title: "Binders (1–3 inch)", category: "Organization", grades: "All", season: "All", price: "Typically $12–$30", store: "Target", icon: "📁", link: "https://www.target.com/s?searchTerm=school+binders" },
  { title: "Copy Paper (Bulk)", category: "Paper & Printing", grades: "All", season: "All", price: "Often $25–$45", store: "Staples", icon: "📄", link: "https://www.staples.com/copy-paper/cat_CL1408" },
  { title: "Laminating Sheets", category: "Paper & Printing", grades: "All", season: "Back to School", price: "Often $15–$30", store: "Amazon", icon: "🖨️", link: `https://www.amazon.com/s?k=laminating+sheets+teacher&tag=${AMAZON_TAG}` },
  { title: "Glue Sticks", category: "Cutting & Craft", grades: "K–5", season: "All", price: "Usually under $15", store: "Amazon", icon: "✂️", link: `https://www.amazon.com/s?k=glue+sticks+bulk+classroom&tag=${AMAZON_TAG}` },
  { title: "Bulletin Board Borders", category: "Display & Decor", grades: "K–5", season: "Back to School", price: "Usually $6–$15", store: "Amazon", icon: "📌", link: `https://www.amazon.com/s?k=bulletin+board+borders+classroom&tag=${AMAZON_TAG}` }
];

/* =========================
   STORE BADGES
   ========================= */

function storeBadge(store) {
  const map = {
    Amazon: ["🛒", "#232f3e"],
    Target: ["🎯", "#cc0000"],
    Staples: ["📎", "#444"]
  };
  const [icon, color] = map[store];
  return `<span style="background:${color};color:white;padding:6px 14px;border-radius:16px;font-size:13px;font-weight:600;">${icon} ${store}</span>`;
}

/* =========================
   AUTH CHECK
   ========================= */

function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

/* =========================
   PUBLIC WELCOME PAGE
   ========================= */

app.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/shop");

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
  color:#2f3e3e;
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text x='0' y='24' font-size='24'>✏️</text></svg>") 0 24, auto;
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
  display:inline-block;
  margin-top:20px;
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
      <p style="font-size:22px;max-width:700px;">
        A calm, beautiful place for teachers to shop classroom essentials.
      </p>
      <a class="button" href="/login">Sign in to start shopping →</a>
    </div>
  </div>
</body>
</html>
  `);
});

/* =========================
   LOGIN / SIGNUP
   ========================= */

app.get("/login", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head><title>Sign In</title></head>
<body style="font-family:Segoe UI,Arial;background:#f6f8f4;display:flex;align-items:center;justify-content:center;height:100vh;">
  <div style="background:white;padding:50px;border-radius:24px;width:360px;text-align:center;">
    <h2>Welcome back</h2>
    <form method="POST">
      <input name="email" placeholder="Email" required style="width:100%;padding:12px;margin:8px 0;border-radius:12px;" />
      <input type="password" name="password" placeholder="Password" required style="width:100%;padding:12px;margin:8px 0;border-radius:12px;" />
      <button style="width:100%;padding:12px;border-radius:18px;background:#2f4f4f;color:white;">Sign In</button>
    </form>
    <p><a href="/signup">Create an account</a></p>
  </div>
</body>
</html>
  `);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (USERS[email] === password) {
    req.session.user = email;
    return res.redirect("/shop");
  }
  res.redirect("/login");
});

app.get("/signup", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head><title>Sign Up</title></head>
<body style="font-family:Segoe UI,Arial;background:#f6f8f4;display:flex;align-items:center;justify-content:center;height:100vh;">
  <div style="background:white;padding:50px;border-radius:24px;width:360px;text-align:center;">
    <h2>Create your account</h2>
    <form method="POST">
      <input name="email" placeholder="Email" required style="width:100%;padding:12px;margin:8px 0;border-radius:12px;" />
      <input type="password" name="password" placeholder="Password" required style="width:100%;padding:12px;margin:8px 0;border-radius:12px;" />
      <button style="width:100%;padding:12px;border-radius:18px;background:#2f4f4f;color:white;">Sign Up</button>
    </form>
  </div>
</body>
</html>
  `);
});

app.post("/signup", (req, res) => {
  USERS[req.body.email] = req.body.password;
  req.session.user = req.body.email;
  res.redirect("/shop");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

/* =========================
   SHOP PAGE (PROTECTED)
   ========================= */

app.get("/shop", requireLogin, (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const category = req.query.category || "";
  const grade = req.query.grade || "";
  const season = req.query.season || "";

  const filtered = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(q) &&
    (!category || p.category === category) &&
    (!grade || p.grades === grade || p.grades === "All") &&
    (!season || p.season === season || p.season === "All")
  );

  const unique = k => [...new Set(PRODUCTS.map(p => p[k]))];

  res.send(`
<!DOCTYPE html>
<html>
<head><title>Shop | Chalk & Save</title></head>
<body style="font-family:Segoe UI,Arial;background:#f6f8f4;margin:0;">

<!-- SHOP BANNER -->
<div style="background:url('https://images.unsplash.com/photo-1588072432836-e10032774350');background-size:cover;background-position:center;padding:70px 20px;color:white;">
  <div style="max-width:1200px;margin:0 auto;background:rgba(0,0,0,.45);padding:28px 36px;border-radius:24px;display:flex;justify-content:space-between;align-items:center;">
    <div>
      <h1 style="margin:0;font-size:34px;">✏️ Chalk & Save</h1>
      <p style="margin:6px 0 0;">Welcome back — happy shopping.</p>
    </div>
    <a href="/logout" style="background:#2f4f4f;color:white;padding:10px 18px;border-radius:18px;text-decoration:none;font-weight:600;">Log out</a>
  </div>
</div>

<!-- FILTERS -->
<form style="text-align:center;padding:30px 20px;background:#eef1ec;">
  <input name="q" placeholder="Search supplies…" />
  <select name="category"><option value="">Category</option>${unique("category").map(c=>`<option>${c}</option>`).join("")}</select>
  <select name="grade"><option value="">Grade</option>${unique("grades").map(g=>`<option>${g}</option>`).join("")}</select>
  <select name="season"><option value="">Season</option>${unique("season").map(s=>`<option>${s}</option>`).join("")}</select>
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
      <a href="${p.link}" target="_blank">View Options →</a>
    </div>
  `).join("")}
</div>

</body>
</html>
  `);
});

/* =========================
   SERVER
   ========================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT);
