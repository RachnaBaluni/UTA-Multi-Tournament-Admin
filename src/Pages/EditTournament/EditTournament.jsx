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

  // ============================
  // UPDATE TOURNAMENT
  // ============================
  const handleUpdate = async () => {
    try {
      setError("");

      const response = await axios.put(
        `${BACKEND}/api/tournaments/${editingTournament._id}`,
        {
          name: editingTournament.name,
          description: editingTournament.description,
          date: editingTournament.date,
          location: editingTournament.location,
          organizer: editingTournament.organizer,
          startDate: editingTournament.startDate,
          endDate: editingTournament.endDate,
          director: editingTournament.director,
          directorPhone: editingTournament.directorPhone,
          status: editingTournament.status,
          type: editingTournament.type,
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

  // ============================
  // DELETE TOURNAMENT
  // ============================
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tournament?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      const response = await axios.delete(
        `${BACKEND}/api/tournaments/${editingTournament._id}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setEditingTournament(null);
        fetchTournaments();
      }
    } catch (error) {
      console.error("Error deleting tournament:", error);

      setError(error.response?.data?.message || "Unable to delete tournament.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Tournament</h1>

      {/* =================================
          EDIT FORM
      ================================= */}
      {editingTournament && (
        <div className={styles.editForm}>
          <h2>Edit Tournament Details</h2>

          {/* TOURNAMENT TYPE */}
          <div className={styles.formGroup}>
            <label>Tournament Type</label>

            <select
              value={editingTournament.type || "normal"}
              onChange={(e) =>
                setEditingTournament({
                  ...editingTournament,
                  type: e.target.value,
                })
              }
            >
              <option value="normal">Normal Tournament</option>
              <option value="display">Display Tournament</option>
            </select>
          </div>

          {/* TOURNAMENT NAME */}
          <div className={styles.formGroup}>
            <label>Tournament Name</label>

            <input
              type="text"
              value={editingTournament.name || ""}
              onChange={(e) =>
                setEditingTournament({
                  ...editingTournament,
                  name: e.target.value,
                })
              }
              placeholder="Enter tournament name"
            />
          </div>

          {/* =================================
              DISPLAY TOURNAMENT FIELDS
          ================================= */}
          {editingTournament.type === "display" && (
            <>
              <div className={styles.formGroup}>
                <label>Description</label>

                <textarea
                  value={editingTournament.description || ""}
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter tournament description"
                  rows="4"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Date</label>

                <input
                  type="date"
                  value={editingTournament.date?.slice(0, 10) || ""}
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      date: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Location</label>

                <input
                  type="text"
                  value={editingTournament.location || ""}
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      location: e.target.value,
                    })
                  }
                  placeholder="Enter tournament location"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Organizer</label>

                <input
                  type="text"
                  value={editingTournament.organizer || ""}
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      organizer: e.target.value,
                    })
                  }
                  placeholder="Enter organizer name"
                />
              </div>
            </>
          )}

          {/* =================================
              NORMAL TOURNAMENT FIELDS
          ================================= */}
          {editingTournament.type !== "display" && (
            <>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Start Date</label>

                  <input
                    type="date"
                    value={editingTournament.startDate?.slice(0, 10) || ""}
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
                    value={editingTournament.endDate?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setEditingTournament({
                        ...editingTournament,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
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

              <div className={styles.formGroup}>
                <label>Status</label>

                <select
                  value={editingTournament.status || "Upcoming"}
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
            </>
          )}

          {/* =================================
              FORM BUTTONS
          ================================= */}
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

            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              Delete Tournament
            </button>
          </div>
        </div>
      )}

      {/* =================================
          LOADING
      ================================= */}
      {loading && <p className={styles.message}>Loading tournaments...</p>}

      {/* =================================
          ERROR
      ================================= */}
      {error && <p className={styles.error}>{error}</p>}

      {/* =================================
          NO TOURNAMENT
      ================================= */}
      {!loading && !error && tournaments.length === 0 && (
        <p className={styles.message}>No tournaments found.</p>
      )}

      {/* =================================
          TOURNAMENT LIST
      ================================= */}
      {!loading && !error && tournaments.length > 0 && (
        <div className={styles.tournamentList}>
          {tournaments.map((tournament) => (
            <div className={styles.tournamentCard} key={tournament._id}>
              <div>
                <h2>{tournament.name}</h2>

                <p>
                  <strong>Type:</strong>{" "}
                  {tournament.type === "display"
                    ? "Display Tournament"
                    : "Normal Tournament"}
                </p>

                {tournament.type === "display" ? (
                  <>
                    <p>
                      <strong>Date:</strong>{" "}
                      {tournament.date
                        ? new Date(tournament.date).toLocaleDateString()
                        : "-"}
                    </p>

                    <p>
                      <strong>Location:</strong> {tournament.location || "-"}
                    </p>

                    <p>
                      <strong>Organizer:</strong> {tournament.organizer || "-"}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Start:</strong>{" "}
                      {tournament.startDate
                        ? new Date(tournament.startDate).toLocaleDateString()
                        : "-"}
                    </p>

                    <p>
                      <strong>End:</strong>{" "}
                      {tournament.endDate
                        ? new Date(tournament.endDate).toLocaleDateString()
                        : "-"}
                    </p>

                    <p>
                      <strong>Director:</strong> {tournament.director || "-"}
                    </p>

                    <p>
                      <strong>Director Phone:</strong>{" "}
                      {tournament.directorPhone || "-"}
                    </p>

                    <p>
                      <strong>Status:</strong> {tournament.status || "-"}
                    </p>
                  </>
                )}
              </div>

              <button
                className={styles.editButton}
                onClick={() => setEditingTournament(tournament)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditTournament;
