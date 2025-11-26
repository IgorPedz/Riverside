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
  database: "riverside",
};

//Pobieranie danych o wszystkich pokojach
app.get("/rooms", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM rooms");
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Pobieranie danych o 1 pokoju
app.get("/api/rooms/:id", async (req, res) => {
  const roomId = parseInt(req.params.id);
  if (isNaN(roomId))
    return res.status(400).json({ error: "Niepoprawne ID pokoju" });

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM rooms LEFT JOIN room_conditions ON rooms.id = room_conditions.room_id WHERE rooms.id = ?",
      [roomId]
    );
    await connection.end();

    if (rows.length === 0)
      return res.status(404).json({ error: "Nie znaleziono pokoju" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Pobieranie danych o użytkownikach
app.get("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Pobieranie danych o udogodnieniach hotelu
app.get("/Amenities", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM amenities");
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Pobieranie zdjęć z galerii
app.get("/gallery", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM gallery");
    await connection.end();
    res.json(rows);
  } catch (err) {
    console.error("Błąd w /galeria:", err);
    res.status(500).json({ error: err.message });
  }
});

//Pobieranie danych o spa
app.get("/spa", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [categories] = await connection.execute(
      "SELECT * FROM spa_categories"
    );

    const [items] = await connection.execute("SELECT * FROM spa_offer_items");

    const result = categories.map((cat) => ({
      id: cat.id,
      title: cat.title,
      hours: cat.hours,
      img: cat.img,
      offer: items
        .filter((item) => item.category_id === cat.id)
        .map((item) => ({ name: item.name, price: item.price })),
    }));

    await connection.end();

    res.json(result);
  } catch (err) {
    console.error("Błąd w /spa:", err);
    res.status(500).json({ error: err.message });
  }
});

//Pobieranie danych o menu
app.get("/meals", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [meals] = await connection.execute("SELECT * FROM meals");

    const [items] = await connection.execute("SELECT * FROM meal_items");

    const result = meals.map((meal) => ({
      id: meal.id,
      name: meal.name,
      hours: meal.hours,
      img: meal.img,
      menu: items
        .filter((item) => item.meal_id === meal.id)
        .map((item) => ({ name: item.name, price: item.price })),
    }));

    await connection.end();

    res.json(result);
  } catch (err) {
    console.error("Błąd w /meals:", err);
    res.status(500).json({ error: err.message });
  }
});

//Rejestracja użytkownika
app.post("/register", async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Wszystkie pola są wymagane" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [existing] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      await connection.end();
      return res
        .status(409)
        .json({ error: "Użytkownik o tym emailu już istnieje" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
      "INSERT INTO users (imie, email, haslo, is_admin) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, isAdmin ? 1 : 0]
    );

    await connection.end();

    res.status(201).json({ message: "Użytkownik zarejestrowany pomyślnie" });
  } catch (err) {
    console.error("Błąd w /register:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

//Logowanie użykownika
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Niepoprawny email lub hasło" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.haslo);

    if (!match) {
      return res.status(401).json({ error: "Niepoprawny email lub hasło" });
    }

    res.json({
      id: user.id,
      name: user.imie,
      email: user.email,
      isAdmin: user.is_admin,
    });

    await connection.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

//Pobieranie informacji o pokoju
app.get("/api/rooms", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rooms] = await connection.execute("SELECT * FROM rooms");

    const [conditions] = await connection.execute(
      "SELECT * FROM room_conditions"
    );

    const [reviews] = await connection.execute("SELECT * FROM room_reviews");

    const roomsWithDetails = rooms.map((room) => {
      const roomConditions = conditions.find((c) => c.room_id === room.id);
      const roomReviews = reviews.filter((r) => r.room_id === room.id);

      return {
        ...room,
        conditions: roomConditions
          ? {
              accessible: roomConditions.accessible === 1,
              breakfast: roomConditions.breakfast === 1,
              pets: roomConditions.pets === 1,
              parking: roomConditions.parking === 1,
            }
          : {},
        reviews: roomReviews.map((r) => ({
          user: r.user_name,
          comment: r.comment,
        })),
      };
    });

    //Pobieranie opinii
    app.get("/api/:type/:id/reviews", async (req, res) => {
      const { type, id } = req.params;

      let tableName;
      switch (type) {
        case "rooms":
          tableName = "room_reviews";
          break;
        case "spa":
          tableName = "spa_reviews";
          break;
        case "restaurant":
          tableName = "restaurant_reviews";
          break;
        default:
          return res.status(400).json({ message: "Niepoprawny typ" });
      }

      try {
        const [rows] = await connection.execute(
          `SELECT id, user_name as user, comment FROM ${tableName} WHERE ${type.slice(
            0,
            -1
          )}_id = ?`,
          [id]
        );
        res.json(rows); // <-- id musi tu być
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera" });
      }
    });

    //Dodawanie opinii
    app.post("/api/:type/:id/reviews", async (req, res) => {
      const { type, id } = req.params;
      const { user_name, comment } = req.body;

      const connection = await mysql.createConnection(dbConfig);

      if (!user_name || !comment) {
        return res.status(400).json({ message: "Brak danych" });
      }

      try {
        let tableName;
        switch (type) {
          case "rooms":
            tableName = "room_reviews";
            break;
          case "spa":
            tableName = "spa_reviews";
            break;
          case "restaurant":
            tableName = "restaurant_reviews";
            break;
          default:
            return res.status(400).json({ message: "Niepoprawny typ" });
        }

        const sql = `INSERT INTO ${tableName} (${type.slice(
          0,
          -1
        )}_id, user_name, comment) VALUES (?, ?, ?)`;
        await connection.execute(sql, [id, user_name, comment]);

        res.status(201).json({ message: "Dodano opinię" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera" });
      }
    });

    res.json(roomsWithDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

//Edycja opinii
app.put("/api/:type/:id/reviews/:reviewId", async (req, res) => {
  const { type, id, reviewId } = req.params;
  const { comment } = req.body;

  const connection = await mysql.createConnection(dbConfig);

  if (!comment) return res.status(400).json({ message: "Brak komentarza" });

  try {
    let tableName;
    switch (type) {
      case "rooms":
        tableName = "room_reviews";
        break;
      case "spa":
        tableName = "spa_reviews";
        break;
      case "restaurant":
        tableName = "restaurant_reviews";
        break;
      default:
        return res.status(400).json({ message: "Niepoprawny typ" });
    }

    const sql = `UPDATE ${tableName} SET comment = ? WHERE id = ? AND ${type.slice(
      0,
      -1
    )}_id = ?`;
    const [result] = await connection.execute(sql, [comment, reviewId, id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Nie znaleziono opinii" });

    res.json({ message: "Opinia zaktualizowana" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

// Usuwanie opinii
app.delete("/api/:type/:id/reviews/:reviewId", async (req, res) => {
  const { type, id, reviewId } = req.params;

  const connection = await mysql.createConnection(dbConfig);

  try {
    let tableName;
    switch (type) {
      case "rooms":
        tableName = "room_reviews";
        break;
      case "spa":
        tableName = "spa_reviews";
        break;
      case "restaurant":
        tableName = "restaurant_reviews";
        break;
      default:
        return res.status(400).json({ message: "Niepoprawny typ" });
    }

    const sql = `DELETE FROM ${tableName} WHERE id = ? AND ${type.slice(
      0,
      -1
    )}_id = ?`;
    const [result] = await connection.execute(sql, [reviewId, id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Nie znaleziono opinii" });

    res.json({ message: "Opinia usunięta" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

//Pobieranie rezerwacji danego pokoju
app.get("/api/rooms/:id/reservations", async (req, res) => {
  const { id } = req.params;

  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute(
      `SELECT id, user_id, start_date, end_date, status
       FROM reservations
       WHERE room_id = ?`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  } finally {
    await connection.end();
  }
});

//Dodawanie rezerwacji
app.post("/api/reservations", async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);

  const { roomId, userId, startDate, endDate, totalPrice, code } = req.body;

  const [user] = await connection.execute(
    "SELECT saldo FROM users WHERE id = ?",
    [userId]
  );

  if (user[0].saldo < totalPrice) {
    await connection.end();
    return res.status(400).json({ error: "Niewystarczające saldo" });
  }

  try {

    const [result] = await connection.execute(
      `INSERT INTO reservations (room_id, user_id, start_date, end_date, total_price, reservationCode)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [roomId, userId, startDate, endDate, totalPrice, code]
    );

    await connection.execute(
      `UPDATE users SET saldo = saldo - ? WHERE id = ?`,
      [totalPrice, userId]
    );

    await connection.end();

    res.json({
      message: "Rezerwacja zapisana, saldo zaktualizowane",
      reservationId: result.insertId,
    });
  } catch (err) {
    console.error("Błąd przy zapisywaniu rezerwacji:", err);
    res.status(500).json({ error: err.message });
  }
});

//Profil wyświetlanie rezerwacji
app.get("/api/reservations/:userId", async (req, res) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Nieprawidłowy ID użytkownika" });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      "SELECT * FROM reservations WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("Błąd pobierania rezerwacji:", err);
    res.status(500).json({ message: "Błąd serwera" });
  } finally {
    if (connection) await connection.end();
  }
});

//Profil anulowanie rezerwacji
app.put("/api/reservations/:id/cancel", async (req, res) => {
  const reservationId = Number(req.params.id);
  if (isNaN(reservationId))
    return res.status(400).json({ message: "Nieprawidłowy ID rezerwacji" });

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [reservationResult] = await connection.execute(
      "SELECT user_id, total_price FROM reservations WHERE id = ?",
      [reservationId]
    );

    if (reservationResult.length === 0) {
      await connection.end();
      return res.status(404).json({ message: "Rezerwacja nie istnieje" });
    }

    const { user_id, total_price } = reservationResult[0];

    await connection.execute("DELETE FROM reservations WHERE id = ?", [
      reservationId,
    ]);

    await connection.execute(
      "UPDATE users SET saldo = saldo + ? WHERE id = ?",
      [total_price, user_id]
    );

    await connection.end();

    res.json({
      message: "Rezerwacja anulowana, środki zwrócone",
      refunded: total_price,
    });
  } catch (err) {
    console.error("Błąd anulowania:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

//Dodawanie ulubionych
app.post("/api/favourites", async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  const { userId, roomId } = req.body;
  try {
    await connection.execute(
      "INSERT INTO favourites (user_id, fav_id) VALUES (?, ?)",
      [userId, roomId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

//Usuwanie ulubionych
app.delete("/api/favourites/:userId/:roomId", async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  const { userId, roomId } = req.params;
  try {
    await connection.execute(
      "DELETE FROM favourites WHERE user_id = ? AND fav_id = ?",
      [userId, roomId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

//Sprawdzanie ulubionych
app.get("/api/favourites/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  if (isNaN(userId))
    return res.status(400).json({ message: "Nieprawidłowy ID użytkownika" });

  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM favourites LEFT JOIN rooms ON favourites.fav_id = rooms.id WHERE user_id = ?",
      [userId]
    );
    res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  } finally {
    await connection.end();
  }
});

//Profil usuwanie konta
app.delete("/users/del/:id", async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  const userId = Number(req.params.id);
  try {
    await connection.execute("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ message: "Użytkownik usunięty" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

//Profil zmiana hasła
app.put("/users/change-password/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Brak wymaganych danych" });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Pobierz obecne hasło użytkownika
    const [rows] = await connection.execute(
      "SELECT haslo FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    const hashedPassword = rows[0].haslo;

    // Sprawdź stare hasło
    const isMatch = await bcrypt.compare(oldPassword, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Nieprawidłowe stare hasło" });
    }

    // Hash nowego hasła
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Aktualizacja w DB
    await connection.execute("UPDATE users SET haslo = ? WHERE id = ?", [
      newHashedPassword,
      userId,
    ]);

    res.json({ message: "Hasło zmienione pomyślnie" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  } finally {
    if (connection) await connection.end();
  }
});
app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
