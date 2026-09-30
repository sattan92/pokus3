import express from "express";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import { createHmac, timingSafeEqual } from "crypto";
// Load .env.local first (Vercel CLI convention), then .env. dotenv does not
// override already-set variables, so .env.local wins — matching Vite's order.
dotenv.config({ path: ".env.local" });
dotenv.config();
const { Pool } = pkg;
import B2 from 'backblaze-b2';

const app = express();

// 1. MUST BE BEFORE express.json() to handle raw bodies if needed later, 
// but for Sell.app JSON is fine.
// The `verify` hook captures the exact raw body bytes so the Sell.app webhook
// signature can be validated over the original (unparsed) payload.
app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf; } }));

// CORS: only allow the known frontend origin(s). Server-to-server requests
// (e.g. the Sell.app webhook) have no Origin header and are always allowed.
const ALLOWED_ORIGINS =
  process.env.NODE_ENV === "production"
    ? ["https://sattanshop.tech", "https://www.sattanshop.tech"]
    : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // Fail loudly instead of silently using a weak, hardcoded secret.
  throw new Error("JWT_SECRET environment variable is not set");
}
const isProduction = process.env.NODE_ENV === "production";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Vercel to connect to cloud DBs
  }
});


// 3. LICENSE CHECK
app.get("/api/licence", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await db.query('SELECT license FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json({ status: result.rows[0].license });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get('/api/get-expire', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const queryText = 'SELECT expire FROM users WHERE id = $1';
  const result = await db.query(queryText, [userId]);
  // Safety Check: Did we find the user?
  try {


    if (result.rows.length === 0) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    const resultValue = result.rows[0].expire;

    if (resultValue === "never") {
      res.json({ status: "never" })
    } else {
      res.json({ status: "none" })
    }
  } catch (err) {
    console.error("Backend Error:", err);
  }
})


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

// Initialize B2 (Keep these in your .env file!)
const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APPLICATION_KEY
});


app.get('/api/list-files', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. License Check
        const result = await db.query('SELECT license FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0 || result.rows[0].license !== true) {
            return res.status(403).json({ error: "License required" });
        }

        // 2. Authorize B2
        const authData = await b2.authorize();
        const downloadUrl = authData.data.downloadUrl;

        // 3. Get the list of files in the 'client/' folder
        const listResponse = await b2.listFileNames({
            bucketId: process.env.B2_BUCKET_ID,
            prefix: 'client/', // Only look in this folder
            delimiter: '/',    // Don't go into subfolders
            maxFileCount: 100
        });

        // 4. Generate ONE token that works for the WHOLE folder
        const tokenResponse = await b2.getDownloadAuthorization({
            bucketId: process.env.B2_BUCKET_ID,
            fileNamePrefix: 'client/', // Authorizes any file starting with 'client/'
            validDurationInSeconds: 3600 // 1 hour
        });

        const authToken = tokenResponse.data.authorizationToken;

        // 5. Format the data for the frontend
        const files = listResponse.data.files.map(file => ({
            name: file.fileName.replace('client/', ''), // "setup.exe" instead of "client/setup.exe"
            url: `${downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${file.fileName}?Authorization=${authToken}`
        }));

        res.json({ files });

    } catch (err) {
        console.error(err);
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
      return res.json({ url: "https://drive.google.com/drive/folders/1GxRNqULgRVDlAfk-fiQvinurrEjTT_7v?usp=sharing" });
    } else {
      // FAIL: User hasn't paid
      return res.status(403).json({ error: "License required to access this link." });
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// --- 2. SELL.APP WEBHOOK ---

// Constant-time string comparison to avoid leaking timing information.
function safeEqual(a, b) {
  const aBuf = Buffer.from(String(a));
  const bBuf = Buffer.from(String(b));
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

// Verifies a Sell.app webhook request. Supports both the legacy `Signature`
// header (hex HMAC-SHA256 of the raw body) and the newer Standard Webhooks
// format (`webhook-id` / `webhook-timestamp` / `webhook-signature`).
function verifyWebhookSignature(req) {
  const secret = process.env.SELLAPP_WEBHOOK_SECRET;
  if (!secret) {
    console.error("❌ SELLAPP_WEBHOOK_SECRET is not set. Webhook rejected.");
    return false;
  }

  const rawBody = req.rawBody ? req.rawBody.toString("utf8") : "";

  // Standard Webhooks (newer): signing input is `${id}.${timestamp}.${rawBody}`.
  const whId = req.headers["webhook-id"];
  const whTimestamp = req.headers["webhook-timestamp"];
  const whSignature = req.headers["webhook-signature"];
  if (whId && whTimestamp && whSignature) {
    const [version, provided] = String(whSignature).split(",");
    if (version !== "v1") return false;

    // Reject replays older than the window (seconds).
    const timestamp = Number(whTimestamp);
    const now = Math.floor(Date.now() / 1000);
    if (!Number.isFinite(timestamp) || Math.abs(now - timestamp) > 300) {
      return false;
    }

    const expected = createHmac("sha256", secret)
      .update(`${whId}.${whTimestamp}.${rawBody}`)
      .digest("base64");
    return safeEqual(provided, expected);
  }

  // Legacy: `Signature` header (hex HMAC-SHA256 over the raw body bytes).
  const signature = req.headers["signature"] ?? req.headers["Signature"] ?? "";
  if (signature) {
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    return safeEqual(signature, expected);
  }

  return false;
}

app.post('/api/webhooks/sellapp', async (req, res) => {
  // Fail closed: only process requests that carry a valid Sell.app signature.
  if (!verifyWebhookSignature(req)) {
    return res.status(401).send("Invalid signature");
  }

  const data = req.body;
  let submittedUsername = "";

  // 1. Extraction Logic (from our previous step)
  if (Array.isArray(data.additional_information)) {
    const flatFields = data.additional_information.flat();
    const userField = flatFields.find(f =>
      f.key?.toLowerCase() === 'username' ||
      f.label?.toLowerCase() === 'username'
    );
    if (userField) submittedUsername = userField.value;
  }

  if (!submittedUsername) {
    console.error("❌ No username found in webhook.");
    return res.status(400).send("Username missing");
  }

  const finalUser = String(submittedUsername).trim().toLowerCase();

  try {
    // 2. The Database Update
    // We use LOWER(username) to ensure it matches even if they typed "Admin2"
    // Replace your old UPDATE query with this one
    const query = `
    UPDATE users 
    SET license = true, 
        expire = 'never' 
    WHERE LOWER(username) = $1
    RETURNING *;
`;

    const result = await pool.query(query, [finalUser]);

    // 3. Check if any row was actually changed
    if (result.rowCount === 0) {
      console.error(`⚠️ Payment received, but user "${finalUser}" does not exist in the database.`);
      // You might want to log this in a "Manual Review" table
      return res.status(404).send("User not found");
    }

    console.log(`✅ SUCCESS: License activated for ${finalUser}`);

    // 4. Send success back to Sell.app
    res.status(200).send("Webhook Processed and License Activated");

  } catch (err) {
    console.error("❌ Database Error during webhook:", err);
    res.status(500).send("Internal Server Error");
  }
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

// Remove your old app.listen and replace it with this:

if (process.env.NODE_ENV !== 'production') {
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}

export default app;