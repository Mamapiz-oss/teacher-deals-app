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

  // DAILY INSTRUCTION
  {
    id:"dry-erase-markers",
    title:"Dry-Erase Markers (Assorted Colors)",
    category:"Daily Instruction",
    price:"$10–$18",
    store:"Amazon",
    icon:"✏️",
    link:`https://www.amazon.com/s?k=dry+erase+markers+classroom&tag=${AMAZON_TAG}`
  },
  {
    id:"sticky-notes",
    title:"Sticky Notes (Multi-Size Packs)",
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

  // ORGANIZATION
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
    title:"File Folders (Assorted Colors)",
    category:"Organization",
    price:"$10–$25",
    store:"Amazon",
    icon:"📁",
    link:`https://www.amazon.com/s?k=file+folders+teacher&tag=${AMAZON_TAG}`
  },

  // PAPER & PRINTING
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
    title:"Construction Paper (Bulk Packs)",
    category:"Paper & Printing",
    price:"$12–$30",
    store:"Amazon",
    icon:"📘",
    link:`https://www.amazon.com/s?k=construction+paper+classroom&tag=${AMAZON_TAG}`
  },

  // CRAFTS
  {
    id:"glue-sticks",
    title:"Glue Sticks (Classroom Pack)",
    category:"Craft Supplies",
    price:"$8–$20",
    store:"Amazon",
    icon:"🧴",
    link:`https://www.amazon.com/s?k=glue+sticks+classroom&tag=${AMAZON_TAG}`
  },
  {
    id:"scissors",
    title:"Scissors (Student-Safe)",
    category:"Craft Supplies",
    price:"$6–$18",
    store:"Amazon",
    icon:"✂️",
    link:`https://www.amazon.com/s?k=scissors+classroom&tag=${AMAZON_TAG}`
  },

  // DISPLAY
  {
    id:"bulletin-borders",
    title:"Bulletin Board Borders",
    category:"Display & Decor",
    price:"$6–$15",
    store:"Amazon",
    icon:"📌",
    link:`https://www.amazon.com/s?k=bulletin+board+borders&tag=${AMAZON_TAG}`
  },

  // CLEANLINESS
  {
    id:"disinfecting-wipes",
    title:"Disinfecting Wipes",
    category:"Classroom Cleanliness",
    price:"$10–$25",
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

function storeBadge(store) {
  const map = {
    Amazon:["🛒","#232f3e"],
    Staples:["📎","#444"]
  };
  const [icon,color] = map[store];
  return `<span style="background:${color};color:white;padding:6px 14px;border-radius:16px;font-size:13px;">${icon} ${store}</span>`;
}

function uniqueCategories() {
  return [...new Set(PRODUCTS.map(p => p.category))];
}

/* =========================
   ROUTES
   ========================= */

app.get("/", (req, res) => {
  if (req.session.userEmail) return res.redirect("/shop");
  res.send(`
    <h1 style="text-align:center;margin-top:120px;">✏️ Chalk & Save</h1>
    <p style="text-align:center;">Smart classroom shopping for teachers</p>
    <p style="text-align:center;"><a href="/login">Sign in to start →</a></p>
  `);
});

/* AUTH */

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

/* FAVORITES */

app.post("/favorite/:id", requireLogin, (req, res) => {
  const user = USERS[req.session.userEmail];
  if (!user.favorites.includes(req.params.id)) {
    user.favorites.push(req.params.id);
  }
  res.redirect("/shop");
});

/* SHOP */

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
        ${uniqueCategories().map(c => `<option ${c===category?"selected":""}>${c}</option>`).join("")}
      </select>
      <button>Search</button>
      <a href="/logout" style="margin-left:20px;">Log out</a>
    </form>

    <div style="text-align:center;">
      ${filtered.map(p => `
        <div style="display:inline-block;width:260px;margin:16px;padding:20px;border-radius:22px;background:white;box-shadow:0 12px 30px rgba(0,0,0,.1);">
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
app.get("/partner", (req, res) => {
  res.send(`
    <div style="max-width:800px;margin:80px auto;font-family:Segoe UI,Arial;">
      <h1>Partner With Chalk & Save</h1>

      <p><strong>Reach teachers where they actually shop.</strong></p>

      <p>
        Chalk & Save is a teacher-focused shopping platform designed to help educators
        find classroom supplies across trusted retailers — without the overwhelm.
      </p>

      <p>
        Teachers spend hundreds (often thousands) of dollars of their own money each year
        on classroom materials. Chalk & Save exists to make that process easier, calmer,
        and more intentional.
      </p>

      <h2>Our Audience</h2>
      <ul>
        <li>K–12 teachers</li>
        <li>Instructional leaders</li>
        <li>Educators purchasing for classrooms, small groups, and school-wide use</li>
      </ul>

      <h2>Partnership Opportunities</h2>
      <ul>
        <li>Featured product placements</li>
        <li>Sponsored collections (Back to School, Testing Season, Classroom Refresh)</li>
        <li>Seasonal highlights</li>
        <li>Affiliate partnerships</li>
        <li>Brand spotlights</li>
      </ul>

      <h2>Why Chalk & Save</h2>
      <ul>
        <li>Built specifically for teachers</li>
        <li>Clean, distraction-free experience</li>
        <li>Transparent recommendations</li>
        <li>No cluttered ads or gimmicks</li>
        <li>Designed for long-term trust</li>
      </ul>

      <h2>Let’s Work Together</h2>
      <p>
        Interested in partnering with Chalk & Save?<br>
        Email: <strong>partnerships@chalkandsave.com</strong>
      </p>
    </div>
  `);
});

/* SERVER */

const PORT = process.env.PORT || 5000;
app.listen(PORT);
