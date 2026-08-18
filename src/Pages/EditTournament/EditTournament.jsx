import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EditTournament.module.css";

const EditTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTournament, setEditingTournament] = useState(null);

  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${BACKEND}/api/tournaments`);

      if (response.data.success) {
        setTournaments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      setError("Unable to fetch tournaments.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setError("");

      const response = await axios.put(
        `${BACKEND}/api/tournaments/${editingTournament._id}`,
        {
          name: editingTournament.name,
          startDate: editingTournament.startDate,
          endDate: editingTournament.endDate,
          director: editingTournament.director,
          directorPhone: editingTournament.directorPhone,
          status: editingTournament.status,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setEditingTournament(null);
        fetchTournaments();
      }
    } catch (error) {
      console.error("Error updating tournament:", error);

      setError(error.response?.data?.message || "Unable to update tournament.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Tournament</h1>
      {editingTournament && (
        <div className={styles.editForm}>
          <h2>Edit Tournament Details</h2>

          <div className={styles.formGroup}>
            <label>Tournament Name</label>

            <input
              type="text"
              value={editingTournament.name}
              onChange={(e) =>
                setEditingTournament({
                  ...editingTournament,
                  name: e.target.value,
                })
              }
              placeholder="Enter tournament name"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Start Date</label>

              <input
                type="date"
                value={editingTournament.startDate?.slice(0, 10)}
                onChange={(e) =>
                  setEditingTournament({
                    ...editingTournament,
                    startDate: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>End Date</label>

              <input
                type="date"
                value={editingTournament.endDate?.slice(0, 10)}
                onChange={(e) =>
                  setEditingTournament({
                    ...editingTournament,
                    endDate: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tournament Director</label>

              <input
                type="text"
                value={editingTournament.director || ""}
                onChange={(e) =>
                  setEditingTournament({
                    ...editingTournament,
                    director: e.target.value,
                  })
                }
                placeholder="Enter tournament director name"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Director Phone Number</label>

              <input
                type="tel"
                value={editingTournament.directorPhone || ""}
                onChange={(e) =>
                  setEditingTournament({
                    ...editingTournament,
                    directorPhone: e.target.value,
                  })
                }
                placeholder="Enter director phone number"
                maxLength="10"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Status</label>

            <select
              value={editingTournament.status}
              onChange={(e) =>
                setEditingTournament({
                  ...editingTournament,
                  status: e.target.value,
                })
              }
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button className={styles.saveButton} onClick={handleUpdate}>
              Save Changes
            </button>

            <button
              className={styles.cancelButton}
              onClick={() => setEditingTournament(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && <p className={styles.message}>Loading tournaments...</p>}

      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && tournaments.length === 0 && (
        <p className={styles.message}>No tournaments found.</p>
      )}

      {!loading && !error && tournaments.length > 0 && (
        <div className={styles.tournamentList}>
          {tournaments.map((tournament) => (
            <div className={styles.tournamentCard} key={tournament._id}>
              <div>
                <h2>{tournament.name}</h2>

                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(tournament.startDate).toLocaleDateString()}
                </p>

                <p>
                  <strong>End:</strong>{" "}
                  {new Date(tournament.endDate).toLocaleDateString()}
                </p>

                <p>
                  <strong>Director:</strong> {tournament.director}
                </p>

                <p>
                  <strong>Director Phone:</strong> {tournament.directorPhone}
                </p>

                <p>
                  <strong>Status:</strong> {tournament.status}
                </p>
              </div>
              <button
                className={styles.editButton}
                onClick={() => setEditingTournament(tournament)}
              >
                Edit
              </button>{" "}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditTournament;
