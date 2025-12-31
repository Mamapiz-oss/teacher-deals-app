const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const AMAZON_TAG = "mywebsit0e2ff-20";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "chalkandsave-secret",
  resave: false,
  saveUninitialized: false
}));

/* =========================
   USERS + FAVORITES (IN MEMORY)
   ========================= */

const USERS = {}; 
// USERS[email] = { password, favorites: [] }

/* =========================
   PRODUCTS
   ========================= */

const PRODUCTS = [
  { id:"markers", title:"Dry-Erase Markers", category:"Daily Instruction", grades:"All", season:"All", price:"Often $10–$18", store:"Amazon", icon:"✏️", link:`https://www.amazon.com/s?k=dry+erase+markers+classroom&tag=${AMAZON_TAG}` },
  { id:"charts", title:"Pocket Charts", category:"Daily Instruction", grades:"K–5", season:"All", price:"Often $15–$30", store:"Amazon", icon:"📊", link:`https://www.amazon.com/s?k=pocket+chart+classroom&tag=${AMAZON_TAG}` },
  { id:"desk", title:"Teacher Desk Organizer", category:"Organization", grades:"All", season:"Back to School", price:"Often $15–$35", store:"Amazon", icon:"🗂️", link:`https://www.amazon.com/s?k=teacher+desk+organizer&tag=${AMAZON_TAG}` },
  { id:"binders", title:"Binders (1–3 inch)", category:"Organization", grades:"All", season:"All", price:"Typically $12–$30", store:"Target", icon:"📁", link:"https://www.target.com/s?searchTerm=school+binders" },
  { id:"paper", title:"Copy Paper (Bulk)", category:"Paper & Printing", grades:"All", season:"All", price:"Often $25–$45", store:"Staples", icon:"📄", link:"https://www.staples.com/copy-paper/cat_CL1408" },
  { id:"laminate", title:"Laminating Sheets", category:"Paper & Printing", grades:"All", season:"Back to School", price:"Often $15–$30", store:"Amazon", icon:"🖨️", link:`https://www.amazon.com/s?k=laminating+sheets+teacher&tag=${AMAZON_TAG}` }
];

/* =========================
   HELPERS
   ========================= */

function storeBadge(store) {
  const map = {
    Amazon:["🛒","#232f3e"],
    Target:["🎯","#cc0000"],
    Staples:["📎","#444"]
  };
  const [icon,color] = map[store];
  return `<span style="background:${color};color:white;padding:6px 14px;border-radius:16px;font-size:13px;font-weight:600;">${icon} ${store}</span>`;
}

function requireLogin(req,res,next){
  if(!req.session.user) return res.redirect("/login");
  next();
}

/* =========================
   WELCOME PAGE
   ========================= */

app.get("/", (req,res)=>{
  if(req.session.user) return res.redirect("/shop");
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Chalk & Save</title>
<style>
body{
  margin:0;font-family:Segoe UI,Arial;background:#f6f8f4;
  cursor:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text x='0' y='24' font-size='24'>✏️</text></svg>") 0 24, auto;
}
.hero{
  background:url('https://images.unsplash.com/photo-1588072432836-e10032774350');
  background-size:cover;background-position:center;
  padding:120px 20px;text-align:center;color:white;
}
.hero-box{
  background:rgba(0,0,0,.45);
  padding:50px 60px;border-radius:28px;display:inline-block;
}
.button{
  background:#2f4f4f;color:white;
  padding:14px 30px;border-radius:28px;
  font-size:16px;font-weight:600;text-decoration:none;
}
</style>
</head>
<body>
  <div class="hero">
    <div class="hero-box">
      <h1 style="font-size:52px;">✏️ Chalk & Save</h1>
      <p style="font-size:22px;">Save your favorite classroom finds.</p>
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

app.get("/login",(req,res)=>{
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

app.post("/login",(req,res)=>{
  const {email,password}=req.body;
  if(USERS[email] && USERS[email].password===password){
    req.session.user=email;
    return res.redirect("/shop");
  }
  res.redirect("/login");
});

app.get("/signup",(req,res)=>{
  res.send(`
<body style="font-family:Segoe UI;background:#f6f8f4;display:flex;justify-content:center;align-items:center;height:100vh;">
<div style="background:white;padding:40px;border-radius:24px;width:360px;text-align:center;">
<h2>Create Account</h2>
<form method="POST">
<input name="email" placeholder="Email" required style="width:100%;padding:12px;margin:6px 0;">
<input type="password" name="password" placeholder="Password" required style="width:100%;padding:12px;margin:6px 0;">
<button style="width:100%;padding:12px;background:#2f4f4f;color:white;border-radius:18px;">Sign Up</button>
</form>
</div>
</body>
`);
});

app.post("/signup",(req,res)=>{
  USERS[req.body.email]={password:req.body.password,favorites:[]};
  req.session.user=req.body.email;
  res.redirect("/shop");
});

/* =========================
   FAVORITES
   ========================= */

app.post("/favorite/:id",requireLogin,(req,res)=>{
  const user=USERS[req.session.user];
  if(!user.favorites.includes(req.params.id)) user.favorites.push(req.params.id);
  res.redirect("/shop");
});

app.get("/favorites",requireLogin,(req,res)=>{
  const favs=PRODUCTS.filter(p=>USERS[req.session.user].favorites.includes(p.id));
  res.send(`
<h1 style="text-align:center;">❤️ My Favorites</h1>
<div style="text-align:center;">
${favs.map(p=>`<p>${p.title}</p>`).join("")}
<a href="/shop">← Back to shop</a>
</div>
`);
});

/* =========================
   SHOP PAGE (FULL UI RESTORED)
   ========================= */

app.get("/shop",requireLogin,(req,res)=>{
  const user=USERS[req.session.user];
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

<!-- SEARCH -->
<form style="text-align:center;padding:30px;background:#eef1ec;">
<input placeholder="Search supplies…" style="padding:10px 14px;border-radius:16px;">
<button style="padding:10px 18px;border-radius:16px;">Browse</button>
</form>

<!-- CARDS -->
<div style="max-width:1200px;margin:40px auto;text-align:center;">
${PRODUCTS.map(p=>`
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

app.get("/logout",(req,res)=>{
  req.session.destroy(()=>res.redirect("/"));
});

/* =========================
   SERVER
   ========================= */

const PORT=process.env.PORT||5000;
app.listen(PORT);
