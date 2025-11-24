import express from "express";
import mysql from "mysql2/promise";
import cors from "cors"; 
import bcrypt from "bcrypt";

const app = express();
const port = 3000;


app.use(cors()); 
app.use(express.json());


const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "riverside"
};

app.get("/pokoje", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM pokoje");
    await connection.end();
    res.json(rows);
  } catch (err) {
    console.error("Błąd w /pokoje:", err); 
    res.status(500).json({ error: err.message });
  }
});


app.get("/uzytkownicy", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM uzytkownicy");
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/udogodnienia", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM udogodnienia");
    await connection.end();
    res.json(rows);
  } catch (err) {
    console.error("Błąd w /udogodnienia:", err); 
    res.status(500).json({ error: err.message });
  }
});

app.get("/galeria", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM galeria");
    await connection.end();
    res.json(rows);
  } catch (err) {
    console.error("Błąd w /galeria:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/spa", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [categories] = await connection.execute("SELECT * FROM spa_categories");

    const [items] = await connection.execute("SELECT * FROM spa_offer_items");

    const result = categories.map(cat => ({
      id: cat.id,
      title: cat.title,
      hours: cat.hours,
      img: cat.img,
      offer: items
        .filter(item => item.category_id === cat.id)
        .map(item => ({ name: item.name, price: item.price }))
    }));

    await connection.end();

    res.json(result);
  } catch (err) {
    console.error("Błąd w /spa:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/meals", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [meals] = await connection.execute("SELECT * FROM meals");

    const [items] = await connection.execute("SELECT * FROM meal_items");

    const result = meals.map(meal => ({
      id: meal.id,
      name: meal.name,
      hours: meal.hours,
      img: meal.img,
      menu: items
        .filter(item => item.meal_id === meal.id)
        .map(item => ({ name: item.name, price: item.price }))
    }));

    await connection.end();

    res.json(result);
  } catch (err) {
    console.error("Błąd w /meals:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Wszystkie pola są wymagane" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [existing] = await connection.execute(
      "SELECT * FROM uzytkownicy WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      await connection.end();
      return res.status(409).json({ error: "Użytkownik o tym emailu już istnieje" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
      "INSERT INTO uzytkownicy (imie, email, haslo, is_admin) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, isAdmin ? 1 : 0]
    );

    await connection.end();

    res.status(201).json({ message: "Użytkownik zarejestrowany pomyślnie" });
  } catch (err) {
    console.error("Błąd w /register:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// server.js
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM uzytkownicy WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Niepoprawny email lub hasło" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.haslo);

    if (!match) {
      return res.status(401).json({ error: "Niepoprawny email lub hasło" });
    }

    // Zwracamy dane użytkownika (bez hasła!)
    res.json({
      id: user.id,
      name: user.imie,
      email: user.email,
      isAdmin: user.is_admin
    });

    await connection.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});



app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
