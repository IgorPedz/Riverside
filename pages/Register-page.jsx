import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../public/logo.png";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/register", formData);
      setMessage(res.data.message);
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      if (err.response) setError(err.response.data.error);
      else setError("Błąd połączenia z serwerem");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-blue-200 via-white to-blue-50">
      <Link to="/">
        <img src={logo} alt="logo" className="p-0 w-300 mb-8" />
      </Link>

      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg mx-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Rejestracja
        </h2>

        {message && (
          <p className="text-green-600 text-center mb-4">{message}</p>
        )}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Imię</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Twoje imię"
              className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Twój e-mail"
              className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Hasło</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Twoje hasło"
              className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Zarejestruj się
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-center">
          Masz już konto?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
}
