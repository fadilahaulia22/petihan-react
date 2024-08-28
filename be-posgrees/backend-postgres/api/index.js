import express from "express";
import { pool } from "../database.js";
import cors from "cors";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

// Public Routes (No authentication required)
app.post("/api/login", async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    req.body.username,
  ]);
  if (result.rows.length > 0) {
    const user = result.rows[0];
    if (await argon2.verify(user.password, req.body.password)) {
      const token = jwt.sign(user, process.env.SECRET_KEY);
      res.json({
        token,
        message: "Login berhasil.",
      });
    } else {
      res.status(401).send("Kata sandi salah.");
    }
  } else {
    res.status(404).send(`Pengguna dengan nama pengguna ${req.body.username} tidak ditemukan.`);
  }
});

app.post("/api/register", async (req, res) => {
  const hash = await argon2.hash(req.body.password);
  await pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
    [req.body.username, hash]
  );
  res.send("Pendaftaran berhasil");
});

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.SECRET_KEY);
      next();
    } catch (error) {
      res.status(401).send("Token tidak valid.");
    }
  } else {
    res.status(401).send("Anda belum login (tidak ada otorisasi).");
  }
}

// Protected Routes (Authentication required)
app.post("/api/products", authenticateToken, async (req, res) => {
  const result = await pool.query(
    "INSERT INTO products (name, price, imageurl) VALUES ($1, $2, $3) RETURNING *",
    [req.body.name, req.body.price, req.body.imageurl]
  );
  res.json(result.rows[0]);
});

app.get("/api/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
});

app.put("/api/products/:id", authenticateToken, async (req, res) => {
  await pool.query(
    "UPDATE products SET name = $1, price= $2, imageurl= $3 WHERE id = $4",
    [req.body.name, req.body.price, req.body.imageurl, req.params.id]
  );
  res.json({
    message: "product berhasil diedit"
  });
});

app.delete("/api/products/:id", authenticateToken, async (req, res) => {
  await pool.query("DELETE FROM products WHERE id= $1", [req.params.id]);
  res.send("Produk berhasil dihapus");
});

app.listen(3000, () => console.log("Server berhasil dijalankan"));