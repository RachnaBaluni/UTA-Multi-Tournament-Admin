import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./NormalPlayers.module.css";

const NormalPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/player/all-players`,
          {
            withCredentials: true,
          },
        );

        console.log("ALL PLAYERS RESPONSE:", response.data);

        if (response.data.success) {
          setPlayers(response.data.data.normalPlayers || []);
        }
      } catch (error) {
        console.error(
          "Error fetching normal players:",
          error.response?.data || error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [backendUrl]);

  if (loading) {
    return <div className={styles.loading}>Loading players...</div>;
  }

  return (
    <div className={styles.normalPlayers}>
      <div className={styles.header}>
        <h1>Normal Players</h1>

        <span className={styles.playerCount}>{players.length} Players</span>
      </div>

      {players.length === 0 ? (
        <div className={styles.noPlayers}>No normal players found.</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.playersTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>WhatsApp Number</th>
                <th>Date of Birth</th>
                <th>City</th>
                <th>Tournaments Participated</th>
              </tr>
            </thead>

            <tbody>
              {players.map((player) => {
                const tournaments = player.tournaments || [];

                return (
                  <tr key={player._id}>
                    {/* Name */}
                    <td data-label="Name">{player.name || "-"}</td>

                    {/* Email */}
                    <td data-label="Email">{player.email || "-"}</td>

                    {/* WhatsApp Number */}
                    <td data-label="WhatsApp Number">
                      {player.whatsappNumber || "-"}
                    </td>

                    {/* Date of Birth */}
                    <td data-label="Date of Birth">
                      {player.dob
                        ? new Date(player.dob).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* City */}
                    <td data-label="City">{player.city || "-"}</td>

                    {/* Tournaments */}
                    <td data-label="Tournaments Participated">
                      {tournaments.length > 0 ? (
                        <div className={styles.tournamentList}>
                          {tournaments.map((tournament, index) => (
                            <div
                              key={tournament.tournamentId || index}
                              className={styles.tournamentItem}
                            >
                              {tournament.tournamentName || "-"}
                            </div>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NormalPlayers;
