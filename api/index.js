import express from "express";
import pkg from "pg"; // Import the Postgres library
const { Pool } = pkg;
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const isProduction = process.env.NODE_ENV === "production";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction 
    ? { rejectUnauthorized: false } // Required for Neon
    : false                         // Not used for local Postgres
});

// REGISTER
// Change "/api/register" to "/api/users" to match your frontend call
app.post("/api/users", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
      [username, email, passwordHash]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

export default app;