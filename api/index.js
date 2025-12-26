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
const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret_for_local_dev";

const isProduction = process.env.NODE_ENV === "production";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction 
    ? { rejectUnauthorized: false } 
    : false                         
});

// --- 1. REGISTER ROUTE ---
app.post("/api/users", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password before saving (Cleanup: standard 10 salt rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
      [username, email, passwordHash]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("DB Error:", error);
    // Cleanup: Check for duplicate email error
    if (error.code === '23505') {
      return res.status(400).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

// --- 2. LOGIN ROUTE ---
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Search for the user by email
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the DB
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (isPasswordValid) {
      // Create a Token that "remembers" the user for 24 hours
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Return success along with the token and username for the frontend
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

export default app;