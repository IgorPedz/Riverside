import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

import ConfirmDialog from "./ConfirmDialog";

export default function Reviews({ type, id }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { user } = useUser();

  const fetchReviews = async () => {
    if (!type || !id) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/${type}/${id}/reviews`
      );
      setReviews(res.data);
      setError(null);
    } catch (err) {
      console.error("Błąd pobierania opinii:", err);
      setError("Nie udało się pobrać opinii");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [type, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !comment) return;

    try {
      await axios.post(`http://localhost:3000/api/${type}/${id}/reviews`, {
        user_name: user.nick,
        comment,
      });
      setComment("");
      fetchReviews();
    } catch (err) {
      console.error("Błąd dodawania opinii:", err);
    }
  };

  const handleEdit = (rev) => {
    setEditingId(rev.id);
    setEditComment(rev.comment);
  };

  const handleSaveEdit = async (revId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/${type}/${id}/reviews/${revId}`,
        {
          comment: editComment,
        }
      );
      setEditingId(null);
      setEditComment("");
      fetchReviews();
    } catch (err) {
      console.error("Błąd edycji opinii:", err);
    }
  };

  const handleDelete = async (revId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/${type}/${id}/reviews/${revId}`
      );
      fetchReviews();
    } catch (err) {
      console.error("Błąd usuwania opinii:", err);
    }
  };

  if (loading) return <p>Ładowanie opinii...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {reviews.map((rev) => (
        <div
          key={rev.id}
          className="border-b border-gray-200 py-2 flex justify-between items-start"
        >
          <div className="flex-1">
            <p className="font-semibold">{rev.user}</p>
            {editingId === rev.id ? (
              <div className="flex flex-col gap-2 mt-1">
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="px-2 py-1 border rounded w-full"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(rev.id)}
                    className="cursor-pointer bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Zapisz
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="cursor-pointer bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-1">{rev.comment}</p>
            )}
          </div>

          {user.nick === rev.user && editingId !== rev.id && (
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleEdit(rev)}
                className="cursor-pointer text-orange-600 hover:text-orange-700 text-sm"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => {
                  setDeleteId(rev.id);
                  setConfirmOpen(true);
                }}
                className="cursor-pointer text-red-600 hover:text-red-700 text-sm"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          )}
        </div>
      ))}
      <ConfirmDialog
        open={confirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          handleDelete(deleteId);
        }}
        title="Usuń opinię"
        message="Czy na pewno chcesz usunąć tę opinię?"
        onCancel={() => setConfirmOpen(false)}
      />
      {user && (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
          <textarea
            placeholder="Twoja opinia"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Dodaj opinię
          </button>
        </form>
      )}

      {!user && (
        <p className="mt-2 text-gray-500">Zaloguj się, aby dodać opinię.</p>
      )}
    </div>
  );
}
