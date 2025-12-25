import express from "express";
import pkg from "pg"; // Import the Postgres library
const { Pool } = pkg;
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Use Environment Variables (Vercel will provide DATABASE_URL automatically)
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon/Vercel Postgres
  }
});

// REGISTER
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    // CHANGE: Postgres uses $1, $2, $3 instead of ?
    await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
      [username, email, passwordHash]
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Note: For Vercel, app.listen is usually not needed if using /api folder,
// but keeping it here for your local testing.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});