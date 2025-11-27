import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "/logo.png";
import { useUser } from "../contexts/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      const userData = {
        id: response.data.id,
        nick: response.data.name,
        email: response.data.email,
        isAdmin: response.data.isAdmin,
      };

      login(userData);
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError("Błąd serwera. Spróbuj ponownie.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-blue-200 via-white to-blue-50">
      <Link to="/">
        <img src={logo} alt="logo" className="p-0 w-300 mb-8" />
      </Link>

      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl mx-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Logowanie
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Twój email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Twoje hasło"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition font-semibold"
          >
            Zaloguj się
          </button>
        </form>

        <p className="mt-6 text-gray-600 text-center">
          Nie masz konta?{" "}
          <Link
            to="/rejestracja"
            className="text-blue-500 hover:underline font-medium"
          >
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
}
