import express from "express";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;

const app = express();

// 1. MUST BE BEFORE express.json() to handle raw bodies if needed later, 
// but for Sell.app JSON is fine. 
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || "change_this_to_something_secure";
const isProduction = process.env.NODE_ENV === "production";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// --- AUTH MIDDLEWARE ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// --- ROUTES ---

app.get('/api/get-link', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check if user has a license in Postgres
    const result = await db.query('SELECT license FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

    if (result.rows[0].license === true) {
      // SUCCESS: Send the real link
      res.json({ url: "https://your-backblaze-link-here.com/file.exe" });
    } else {
      // FAIL: Deny access
      res.status(403).json({ error: "You must purchase a license first." });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// --- 1. SECURE DOWNLOAD ROUTE ---
app.get('/api/get-download-link', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Check if user has paid
    const user = await db.query('SELECT license FROM users WHERE id = $1', [userId]);
    
    if (user.rows[0]?.license) {
      // SUCCESS: User has license = true
      return res.json({ url: "https://docs.google.com/your-private-link" });
    } else {
      // FAIL: User hasn't paid
      return res.status(403).json({ error: "License required to access this link." });
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// --- 2. SELL.APP WEBHOOK ---
app.post('/api/webhooks/sellapp', async (req, res) => {
    const data = req.body;
    
    // Sell.app usually sends the hash ID you found earlier
    const fieldHash = "f6039d44b29456b20f8f373155ae4973";
    
    // Check multiple places where the username might be hiding
    let submittedUsername = 
        data.additional_information?.[fieldHash] || 
        data.custom_fields?.[fieldHash] ||
        (data.additional_information && Object.values(data.additional_information)[0]);

    if (!submittedUsername) {
        console.error("❌ No username found in webhook data!");
        return res.status(400).send("No username provided");
    }

    // Convert to lowercase to match your database login logic
    const finalUser = submittedUsername.trim().toLowerCase();

    console.log(`💰 Payment received for: ${finalUser}`);
    
    // Update the database (ensure your SQL query uses lowercase comparison)
    // UPDATE users SET license_status = 'Active' WHERE LOWER(username) = $1
});

// 4. DB HEALTH CHECK
app.get('/api/db-check', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ connected: true });
  } catch (err) {
    res.status(500).json({ connected: false });
  }
});

// 5. REGISTER
app.post("/api/users", async (req, res) => {
  const { username, email, password, captchaToken } = req.body;
  if (!captchaToken) return res.status(400).json({ message: "Captcha missing" });

  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
    const captchaRes = await fetch(verifyUrl, { method: 'POST' });
    const captchaData = await captchaRes.json();
    if (!captchaData.success) return res.status(400).json({ message: "Captcha failed" });

    const passwordHash = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)", [username, email, passwordHash]);
    res.json({ success: true });
  } catch (error) {
    if (error.code === '23505') return res.status(400).json({ error: "Email/Username taken" });
    res.status(500).json({ error: "Database error" });
  }
});

// 6. LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password, captchaToken } = req.body;
  if (!captchaToken) return res.status(400).json({ error: "Captcha missing" });

  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
    const captchaRes = await fetch(verifyUrl, { method: "POST" });
    const captchaData = await captchaRes.json();
    if (!captchaData.success) return res.status(401).json({ error: "Captcha failed" });

    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (valid) {
      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });
      res.json({ success: true, token, username: user.username });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3001, () => { console.log("Server running on 3001"); });
export default app;