import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import ConfirmDialog from "../components/ConfirmDialog";
import ChangePasswordModal from "../components/ChangePasswordModal";
import MoneyModal from "../components/MoneyModal";
import ErrorMessage from "../components/ErrorMessage";

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [reservations, setReservations] = useState({ rooms: [], spa: [] });
  const [favorites, setFavorites] = useState([]);
  const [users, setUsers] = useState([]);
  const [type, setType] = useState("");

  const [confirmMoneyOpen, setConfirmMoneyOpen] = useState(false);
  const [confirmDeclineOpen, setConfirmDeclineOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmSurenessDeleteOpen, setConfirmSurenessDeleteOpen] =
    useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const [error, setError] = useState("");

  const tabFromUrl = searchParams.get("tab");

  const [tab, setTab] = useState(tabFromUrl || "rezerwacje");

  useEffect(() => {
    const newTab = searchParams.get("tab") || "rezerwacje";
    setTab(newTab);
  }, [searchParams]);

  if (!user) navigate("/login");

  const handleTopUp = async (amount) => {
    try {
      await axios.put(`http://localhost:3000/api/users/${user.id}/topup`, {
        amount,
      });
      fetchUsers();
    } catch (err) {
      console.error("Błąd doładowania konta:", err);
    }
  };

  const changeTab = (newTab) => {
    setTab(newTab);
    setSearchParams({});
  };

  const fetchReservations = async () => {
    if (!user) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/reservations/${user.id}`
      );
      const data = response.data;
      setReservations({
        rooms: Array.isArray(data.rooms) ? data.rooms : [],
        spa: Array.isArray(data.spa) ? data.spa : [],
      });
    } catch (err) {
      console.error("Błąd pobierania rezerwacji:", err);
      setReservations({ rooms: [], spa: [] });
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/favourites/${user.id}`
      );
      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Błąd pobierania ulubionych:", err);
    }
  };

  const fetchUsers = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:3000/users/${user.id}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Błąd pobierania użytkowników:", err);
    }
  };

  const handleCancel = async (reservationId, type) => {
    try {
      await axios.put(
        `http://localhost:3000/api/reservations/${reservationId}/cancel`,
        { type }
      );
      fetchReservations();
    } catch (err) {
      console.error("Błąd przy odwoływaniu rezerwacji:", err);
    }
  };

  const handleDeleteAcc = async () => {
    try {
      await axios.delete(`http://localhost:3000/users/del/${user.id}`);
      logout();
    } catch (err) {
      console.error("Błąd przy usuwaniu konta:", err);
    }
  };

  const handleChangePassword = async (oldPass, newPass) => {
    try {
      await axios.put(
        `http://localhost:3000/users/change-password/${user.id}`,
        {
          oldPassword: oldPass,
          newPassword: newPass,
        }
      );
      setError("Zmiana hasła się powiodła");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Błąd serwera");
      }
    }
  };

  useEffect(() => {
    if (tab === "rezerwacje") fetchReservations();
    if (tab === "ulubione") fetchFavorites();
    if (tab === "konto") fetchUsers();
  }, [tab, user]);

  const renderContent = () => {
    const MotionDiv = motion.div;

    switch (tab) {
      case "rezerwacje":
        const allReservations = [
          ...(reservations.rooms || []),
          ...(reservations.spa || []),
        ];

        return (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {allReservations.length === 0 ? (
              <p>Brak rezerwacji</p>
            ) : (
              <ul className="space-y-2">
                {reservations.rooms.map((r) => (
                  <li
                    key={`room-${r.id}`}
                    className="border p-3 rounded-lg bg-white shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        Pokój: {r.name} - Kod rezerwacji: {r.reservationCode}
                      </p>
                      <p className="text-gray-600">
                        Data: {new Date(r.start_date).toLocaleDateString()} —{" "}
                        {new Date(r.end_date).toLocaleDateString()}
                      </p>
                      {r.status !== "cancelled" && (
                        <button
                          onClick={() => {
                            setConfirmDeclineOpen(true);
                            setReservationId(r.id);
                            setType("room");
                          }}
                          className="cursor-pointer text-white mt-2 px-3 py-1 text-sm bg-red-600 border border-red-600 rounded hover:bg-red-700 transition"
                        >
                          Odwołaj
                        </button>
                      )}
                    </div>
                    {r.total_price && (
                      <div className="text-right font-medium text-gray-700">
                        {r.total_price} PLN
                      </div>
                    )}
                  </li>
                ))}

                {reservations.spa.map((r) => (
                  <li
                    key={`spa-${r.id}`}
                    className="border p-3 rounded-lg bg-white shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        SPA: {r.offerName} ({r.categoryTitle}) - Kod rezerwacji:{" "}
                        {r.code}
                      </p>
                      <p className="text-gray-600">
                        Data: {new Date(r.date).toLocaleDateString()} — Godzina:{" "}
                        {r.hour}
                      </p>
                      {r.status !== "cancelled" && (
                        <button
                          onClick={() => {
                            setConfirmDeclineOpen(true);
                            setReservationId(r.id);
                            setType("spa");
                          }}
                          className="cursor-pointer text-white mt-2 px-3 py-1 text-sm bg-red-600 border border-red-600 rounded hover:bg-red-700 transition"
                        >
                          Odwołaj
                        </button>
                      )}
                    </div>
                    {r.price && (
                      <div className="text-right font-medium text-gray-700">
                        {r.price} PLN
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </MotionDiv>
        );

      case "ulubione":
        return (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {favorites.length === 0 ? (
              <p>Nie masz jeszcze ulubionych pokoi</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="flex flex-col items-center bg-white rounded-lg shadow p-4"
                  >
                    <img
                      src={fav.img}
                      alt={fav.name}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                    <button
                      onClick={() => handleSeeMore(fav.fav_id)}
                      className="cursor-pointer mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Zobacz szczegóły
                    </button>
                    <h3 className="text-lg font-semibold">{fav.name}</h3>
                  </div>
                ))}
              </div>
            )}
          </MotionDiv>
        );

      case "konto":
        return (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center p-8 rounded-xl shadow-md gap-6 bg-green-50 overflow-y-auto "
          >
            <div className="text-gray-500 mb-4 text-sm uppercase">
              Twoje aktualne saldo
            </div>
            <div className="text-5xl font-bold text-green-600 flex items-center gap-2">
              {users.length > 0 &&
                users.map((u) => (
                  <div key={u.id}>
                    <p>{u.saldo}</p>
                  </div>
                ))}{" "}
              PLN
            </div>
            <div className="text-gray-600 mt-2 text-center">
              Możesz wykorzystać środki do zakupów na naszej stronie
            </div>

            {/* Przyciski konta */}
            <div className="flex flex-col mt-6 w-full">
              <button
                className="cursor-pointer w-full py-5 rounded-t bg-white hover:bg-gray-300 transition"
                onClick={() => setConfirmMoneyOpen(true)}
              >
                Doładuj konto
              </button>
              <MoneyModal
                isOpen={confirmMoneyOpen}
                onClose={() => setConfirmMoneyOpen(false)}
                onTopUp={handleTopUp}
              />

              <div className="flex flex-col gap-4">
                <button
                  className="cursor-pointer w-full px-6 py-5 bg-white hover:bg-gray-300 transition"
                  onClick={() => setModalOpen(true)}
                >
                  Zmień hasło
                </button>
                <ChangePasswordModal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  onChangePassword={handleChangePassword}
                />
              </div>
              <button
                className="cursor-pointer w-full py-5 rounded-t bg-white hover:bg-gray-300 transition"
                onClick={() => setConfirmLogoutOpen(true)}
              >
                Wyloguj
              </button>
              <button
                className="cursor-pointer w-full px-6 py-5 rounded-b bg-red-600 text-white hover:bg-red-700 transition"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                Usuń konto
              </button>
            </div>
          </MotionDiv>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 bg-decor-soft">
      {error && <ErrorMessage header="Zmiana hasła" message={error} />}
      <ConfirmDialog
        open={confirmDeclineOpen}
        onConfirm={() => {
          setConfirmDeclineOpen(false);
          handleCancel(reservationId, type);
        }}
        title="Usuń rezerwację"
        message="Czy na pewno chcesz usunąć tę rezerwację?"
        onCancel={() => setConfirmDeclineOpen(false)}
      />
      <ConfirmDialog
        open={confirmLogoutOpen}
        onConfirm={() => {
          setConfirmLogoutOpen(false);
          logout();
        }}
        title="Wyloguj się"
        message="Czy na pewno chcesz się wylogować?"
        onCancel={() => setConfirmLogoutOpen(false)}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        onConfirm={() => {
          setConfirmSurenessDeleteOpen(true);
          setConfirmDeleteOpen(false);
        }}
        title="USUŃ KONTO"
        message="Czy na pewno chcesz usunąć konto?"
        onCancel={() => setConfirmDeleteOpen(false)}
      />
      <ConfirmDialog
        open={confirmSurenessDeleteOpen}
        onConfirm={() => {
          setConfirmSurenessDeleteOpen(false);
          handleDeleteAcc();
        }}
        title="USUŃ KONTO"
        message="CZY NA PEWNO chcesz usunąć konto?"
        onCancel={() => setConfirmSurenessDeleteOpen(false)}
      />
      <div className="mt-20 bg-white shadow-lg rounded-xl w-full max-w-4xl p-6">
        <h1 className="text-center text-3xl font-bold mb-6">Profil</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => changeTab("rezerwacje")}
            className={`cursor-pointer text-center py-3 rounded-lg font-medium transition ${
              tab === "rezerwacje"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Moje Rezerwacje
          </button>

          <button
            onClick={() => changeTab("ulubione")}
            className={`cursor-pointer text-center py-3 rounded-lg font-medium transition ${
              tab === "ulubione"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Moje Ulubione
          </button>

          <button
            onClick={() => changeTab("konto")}
            className={`cursor-pointer text-center py-3 rounded-lg font-medium transition ${
              tab === "konto"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Konto
          </button>
        </div>

        <div className="border rounded-lg p-6 bg-gray-50 transition-all duration-500 ease-in-out transform animate-fadeIn">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
