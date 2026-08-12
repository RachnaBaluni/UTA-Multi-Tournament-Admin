import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EditTournament.module.css";

const EditTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Tournament</h1>

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
                  <strong>Status:</strong> {tournament.status}
                </p>
              </div>

              <button className={styles.editButton}>Edit</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditTournament;
