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

//Pobieranie danych o 1 zabiegu SPA
app.get("/spa/:offerId", async (req, res) => {
  const { offerId } = req.params; 
  const connection = await mysql.createConnection(dbConfig);

    let cateId = null;
    let id = offerId;

    const parts = id.split("-");
    cateId = parts[0]; 
    id = parts[1]; 

  try {
    const [items] = await connection.execute(
      "SELECT * FROM spa_offer_items WHERE id = ?",
      [id]
    );

    if (items.length === 0) {
      await connection.end();
      return res.status(404).json({ message: "Nie znaleziono oferty SPA" });
    }

    const item = items[0];

    const [categories] = await connection.execute(
      "SELECT * FROM spa_categories WHERE id = ?",
      [item.category_id]
    );

    if (categories.length === 0) {
      await connection.end();
      return res.status(404).json({ message: "Nie znaleziono kategorii SPA" });
    }

    const category = categories[0];

    const result = {
      id: item.id,
      name: item.name,
      price: item.price,
      categoryId: category.id,
      categoryTitle: category.title,
      hours: category.hours,
      img: category.img,
    };

    await connection.end();
    res.json(result);
  } catch (err) {
    console.error("Błąd w /spa/:offerId:", err);
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
    res.json(roomsWithDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

//Pobieranie opinii
app.get("/api/:type/:id/reviews", async (req, res) => {
  const { type, id } = req.params;

  const connection = await mysql.createConnection(dbConfig);

  try {
    let rows;

    switch (type) {
      case "rooms":
        [rows] = await connection.execute(
          "SELECT id, user_name as user, comment FROM room_reviews WHERE room_id = ?",
          [id]
        );
        break;

      case "restaurant":
        [rows] = await connection.execute(
          "SELECT id, user_name as user, comment FROM restaurant_reviews WHERE restaurant_id = ?",
          [id]
        );
        break;

      case "spa":
        const [categoryId, offerIndex] = id.split("-");
        if (!categoryId || offerIndex === undefined)
          return res
            .status(400)
            .json({ message: "Niepoprawny format id dla SPA" });

        [rows] = await connection.execute(
          "SELECT id, user_name as user, comment, category_id FROM spa_reviews WHERE category_id = ? AND spa_offer_id = ?",
          [categoryId, offerIndex]
        );
        break;

      default:
        return res.status(400).json({ message: "Niepoprawny typ" });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

// Dodawanie opinii
app.post("/api/:type/:id/reviews", async (req, res) => {
  const { type, id } = req.params;
  console.log(id);
  const { user_name, comment, categoryId } = req.body; // SPA może wysyłać category_id

  let cateId = null;
  let offerId = id; // domyślnie całe id

  if (type === "spa" && id.includes("-")) {
    const parts = id.split("-");
    cateId = parts[0]; // pierwsza część to category_id
    offerId = parts[1]; // druga część to offer_id
  }

  if (!user_name || !comment) {
    return res.status(400).json({ message: "Brak danych" });
  }

  const connection = await mysql.createConnection(dbConfig);

  try {
    switch (type) {
      case "rooms":
        // room_reviews: room_id, user_name, comment
        await connection.execute(
          "INSERT INTO room_reviews (room_id, user_name, comment) VALUES (?, ?, ?)",
          [id, user_name, comment]
        );
        break;

      case "restaurant":
        // restaurant_reviews: restaurant_id, user_name, comment
        await connection.execute(
          "INSERT INTO restaurant_reviews (restaurant_id, user_name, comment) VALUES (?, ?, ?)",
          [id, user_name, comment]
        );
        break;

      case "spa":
        // spa_reviews: spa_id, category_id, user_name, comment
        await connection.execute(
          "INSERT INTO spa_reviews (spa_offer_id, category_id, user_name, comment) VALUES (?, ?, ?, ?)",
          [offerId, cateId, user_name, comment]
        );
        break;

      default:
        return res.status(400).json({ message: "Niepoprawny typ" });
    }

    res.status(201).json({ message: "Dodano opinię" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  } finally {
    await connection.end();
  }
});

//Edycja opinii
app.put("/api/:type/:id/reviews/:reviewId", async (req, res) => {
  const { type, id, reviewId } = req.params;
  const { comment } = req.body;

  let cateId = null;
  let offerId = id; // domyślnie całe id

  if (type === "spa" && id.includes("-")) {
    const parts = id.split("-");
    cateId = parts[0]; // pierwsza część to category_id
    offerId = parts[1]; // druga część to offer_id
  }

  if (!comment) return res.status(400).json({ message: "Brak komentarza" });

  const connection = await mysql.createConnection(dbConfig);

  try {
    let result;

    switch (type) {
      case "rooms":
        [result] = await connection.execute(
          "UPDATE room_reviews SET comment = ? WHERE id = ? AND room_id = ?",
          [comment, reviewId, id]
        );
        break;

      case "spa":
        [result] = await connection.execute(
          "UPDATE spa_reviews SET comment = ? WHERE id = ? AND spa_offer_id = ?",
          [comment, reviewId, offerId]
        );
        break;

      case "restaurant":
        [result] = await connection.execute(
          "UPDATE restaurant_reviews SET comment = ? WHERE id = ? AND restaurant_id = ?",
          [comment, reviewId, id]
        );
        break;

      default:
        return res.status(400).json({ message: "Niepoprawny typ" });
    }

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Nie znaleziono opinii" });

    res.json({ message: "Opinia zaktualizowana" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  } finally {
    await connection.end();
  }
});

// Usuwanie opinii
app.delete("/api/:type/:id/reviews/:reviewId", async (req, res) => {
  const { type, id, reviewId } = req.params;

  const connection = await mysql.createConnection(dbConfig);

  let cateId = null;
  let offerId = id;

  if (type === "spa" && id.includes("-")) {
    const parts = id.split("-");
    cateId = parts[0];
    offerId = parts[1];
  }

  try {
    let result;

    switch (type) {
      case "rooms":
        [result] = await connection.execute(
          "DELETE FROM room_reviews WHERE id = ? AND room_id = ?",
          [reviewId, id]
        );
        break;

      case "spa":
        [result] = await connection.execute(
          "DELETE FROM spa_reviews WHERE id = ? AND spa_offer_id = ?",
          [reviewId, offerId]
        );
        break;

      case "restaurant":
        // Usuwanie opinii z restaurant_reviews
        [result] = await connection.execute(
          "DELETE FROM restaurant_reviews WHERE id = ? AND restaurant_id = ?",
          [reviewId, id]
        );
        break;

      default:
        return res.status(400).json({ message: "Niepoprawny typ" });
    }

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Nie znaleziono opinii" });

    res.json({ message: "Opinia usunięta" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  } finally {
    await connection.end();
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

//Pobieranie rezerwacji danej usługi SPA
app.get("/api/reservations/spa/:id", async (req, res) => {
  const { id } = req.params;

  let cateId = null;
  let offerId = id; 

    const parts = id.split("-");
    cateId = parts[0]; 
    offerId = parts[1]; 

  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute(
      `SELECT date, hour
       FROM reservations_spa
       WHERE offer_id = ?`,
      [offerId]
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

// Dodawanie rezerwacji SPA
app.post("/api/spa/reservations", async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);

  const { spaOfferId, categoryId, userId, date, hour, price, code } = req.body;

  try {
    const [user] = await connection.execute(
      "SELECT saldo FROM users WHERE id = ?",
      [userId]
    );

    if (!user[0] || user[0].saldo < price) {
      await connection.end();
      return res.status(400).json({ error: "Niewystarczające saldo" });
    }

    const [result] = await connection.execute(
      `INSERT INTO reservations_spa
       (offer_id, category_id, user_id, date, hour, price, code)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [spaOfferId, categoryId, userId, date, hour, price, code]
    );

    // Aktualizacja salda użytkownika
    await connection.execute(
      `UPDATE users SET saldo = saldo - ? WHERE id = ?`,
      [price, userId]
    );

    await connection.end();

    res.json({
      message: "Rezerwacja SPA zapisana, saldo zaktualizowane",
      reservationId: result.insertId,
    });
  } catch (err) {
    console.error("Błąd przy zapisywaniu rezerwacji SPA:", err);
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

    // Rezerwacje pokoi
    const [roomReservations] = await connection.execute(
      "SELECT reservations.*, 'room' AS type,rooms.name FROM reservations LEFT JOIN rooms ON reservations.room_id = rooms.id WHERE user_id = ? ORDER BY created_at DESC;",
      [userId]
    );

    // Rezerwacje SPA
    const [spaReservations] = await connection.execute(
      `SELECT sr.*, s.name AS offerName, sc.title AS categoryTitle, 'spa' AS type FROM reservations_spa sr 
      JOIN spa_offer_items s ON sr.offer_id = s.id 
      JOIN spa_categories sc ON sr.category_id = sc.id 
      WHERE sr.user_id = ? 
      ORDER BY sr.created_at DESC;`,
      [userId]
    );

    res.json({
      rooms: Array.isArray(roomReservations) ? roomReservations : [],
      spa: Array.isArray(spaReservations) ? spaReservations : [],
    });
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
  const { type } = req.body; // "room" lub "spa"

  if (isNaN(reservationId))
    return res.status(400).json({ message: "Nieprawidłowy ID rezerwacji" });

  if (!type || !["room", "spa"].includes(type))
    return res.status(400).json({ message: "Nieprawidłowy typ rezerwacji" });

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    let query, reservation;
    if (type === "room") {
      query = "SELECT user_id, total_price FROM reservations WHERE id = ?";
    } else if (type === "spa") {
      query =
        "SELECT user_id, price AS total_price FROM reservations_spa WHERE id = ?";
    }

    const [reservationResult] = await connection.execute(query, [
      reservationId,
    ]);

    if (reservationResult.length === 0) {
      await connection.end();
      return res.status(404).json({ message: "Rezerwacja nie istnieje" });
    }

    reservation = reservationResult[0];
    const { user_id, total_price } = reservation;

    // Usuwanie rezerwacji
    if (type === "room") {
      await connection.execute("DELETE FROM reservations WHERE id = ?", [
        reservationId,
      ]);
    } else if (type === "spa") {
      await connection.execute("DELETE FROM reservations_spa WHERE id = ?", [
        reservationId,
      ]);
    }

    // Zwrot środków
    await connection.execute(
      "UPDATE users SET saldo = saldo + ? WHERE id = ?",
      [total_price, user_id]
    );

    await connection.end();

    res.json({
      message: `Rezerwacja ${
        type === "room" ? "pokoju" : "SPA"
      } anulowana, środki zwrócone`,
      refunded: total_price,
    });
  } catch (err) {
    console.error("Błąd anulowania:", err);
    if (connection) await connection.end();
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

//Profil doładowanie konta
app.put("/api/users/:id/topup", async (req, res) => {
  const userId = Number(req.params.id);
  const { amount } = req.body;

  if (isNaN(userId) || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Nieprawidłowe dane" });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      "UPDATE users SET saldo = saldo + ? WHERE id = ?",
      [amount, userId]
    );
    await connection.end();
    res.json({ message: "Doładowanie zakończone", amount });
  } catch (err) {
    console.error("Błąd doładowania:", err);
    if (connection) await connection.end();
    res.status(500).json({ message: "Błąd serwera" });
  }
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
