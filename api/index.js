import express from "express";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Added for login sessions
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());
app.use(cors());

// Use a secret key for signing tokens (Stored in .env)
const JWT_SECRET = process.env.JWT_SECRET || "apsoijdoaisjdoiaJsoidjaoisjdoijasoidjoaisjd";

const isProduction = process.env.NODE_ENV === "production";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false
});

// 2. Setup the tracking variables (Global scope)
let lastCheckTime = 0;
let lastStatus = false;
const COOLDOWN_MS = 60000;

// --- AUTHENTICATION MIDDLEWARE ---
// This acts as the "Bouncer". It checks the token before letting the user in.
function authenticateToken(req, res, next) {
  // 1. Get the token from the headers (Frontend sends: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get just the token part

  if (!token) return res.sendStatus(401); // No token? Kick them out (Unauthorized)

  // 2. Verify the token using your secret key
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token? Forbidden.

    // 3. Attach the user info to the request so the route can see it
    req.user = user; 
    next(); // Pass control to the next function (your route)
  });
}

app.get('/api/get-link'), authenticateToken, async (req, res) => {

}

// Add authenticateToken here!
app.get('/api/get-expire', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const queryText = 'SELECT expire FROM users WHERE id = $1';
    const result = await db.query(queryText, [userId]);

    // Safety Check: Did we find the user?
    if (result.rows.length === 0) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const resultValue = result.rows[0].expire;
    
    if (resultValue === "never"){
      res.json({status: "never"})
    } else {
      res.json({status: "none"})
    }
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({status: "error"})
  }
})

// 3. The Route (Now it can 'see' everything above it)
app.get('/api/db-check', async (req, res) => {
  const now = Date.now();
  
  if (now - lastCheckTime < COOLDOWN_MS) {
    return res.status(429).json({
      connected: lastStatus,
      message: "Cooldown active. Sending cached status."
    });
  }

  try {
    // Using the pool we defined above
    await db.query('SELECT 1');
    lastStatus = true;
    lastCheckTime = now;
    res.json({ connected: true });
  } catch (err) {
    lastStatus = false;
    // This resets the timer even on failure so they can't spam the error log either
    lastCheckTime = now;
    console.error("DATABASE HEALTH CHECK FAILED:", err.message);
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Note the addition of 'authenticateToken' as the second argument here!
app.get("/api/licence", authenticateToken, async (req, res) => {
  try {
    // BUG FIX: Your token payload uses 'userId', not 'id'
    const userId = req.user.userId; 
    
    console.log("Fetching license for User ID:", userId); // Debug log

    const queryText = 'SELECT license FROM users WHERE id = $1';
    const result = await db.query(queryText, [userId]);

    // BUG FIX: Fixed typo 'lenght' -> 'length'
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      status: result.rows[0].license
    });
    
  } catch (err) {
    console.error("License Route Error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// --- 1. REGISTER ROUTE ---
app.post("/api/users", async (req, res) => {
  // Extract data from the request body
  // Note: We use 'captchaToken' to match your React code
  const { username, email, password, captchaToken } = req.body;

  // --- STEP 1: CAPTCHA VERIFICATION ---
  if (!captchaToken) {
    return res.status(400).json({ message: "Captcha token is missing" });
  }

  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
    
    const captchaRes = await fetch(verifyUrl, { method: 'POST' });
    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      // If the captcha is invalid, we STOP here and don't touch the DB
      return res.status(400).json({ message: "Captcha failed. Are you a robot?" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Captcha service unavailable" });
  }

  // --- STEP 2: DATABASE LOGIC ---
  try {
    // Hash the password before saving
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user (license defaults to false in your DB schema)
    await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
      [username, email, passwordHash]
    );

    res.json({ success: true, message: "Registered successfully!" });
  } catch (error) {
    console.error("DB Error:", error);
    
    // Check for duplicate email error (Postgres code 23505)
    if (error.code === '23505') {
      return res.status(400).json({ error: "Email already in use" });
    }
    
    res.status(500).json({ error: "Database error" });
  }
});

// --- 2. LOGIN ROUTE ---
app.post("/api/login", async (req, res) => {
  const { email, password, captchaToken } = req.body;

  // STEP 1: VERIFY CAPTCHA FIRST
  if (!captchaToken) {
    return res.status(400).json({ error: "Captcha verification required" });
  }

  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
    const captchaRes = await fetch(verifyUrl, { method: "POST" });
    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      return res.status(401).json({ error: "Captcha failed. Are you a robot?" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Security service unavailable" });
  }

  // STEP 2: PROCEED TO LOGIN LOGIC
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (isPasswordValid) {
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        success: true,
        token,
        username: user.username
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3001, () => { console.log("Server on 3001"); });

export default app;