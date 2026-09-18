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
          { withCredentials: true },
        );

        if (response.data.success) {
          setPlayers(response.data.data.normalPlayers || []);
        }
      } catch (error) {
        console.error("Error fetching normal players:", error);
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
                <th>Shirt Size</th>
                <th>Food Preference</th>
                <th>Stay</th>
                <th>Fee Paid</th>
                <th>Transaction Details</th>
                <th>Fee Paid Admin</th>
              </tr>
            </thead>

            <tbody>
              {players.map((player) => (
                <tr key={player._id}>
                  {/* Name */}
                  <td data-label="Name">{player.name || "-"}</td>

                  {/* Email */}
                  <td data-label="Email">{player.email || "-"}</td>

                  {/* WhatsApp */}
                  <td data-label="WhatsApp Number">
                    {player.whatsappNumber || "-"}
                  </td>

                  {/* DOB */}
                  <td data-label="Date of Birth">
                    {player.dob
                      ? new Date(player.dob).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* City */}
                  <td data-label="City">{player.city || "-"}</td>

                  {/* Tournaments */}
                  <td data-label="Tournaments Participated">
                    {player.tournamentRegistrations?.length > 0 ? (
                      <div className={styles.tournamentList}>
                        {player.tournamentRegistrations.map(
                          (registration, index) => (
                            <div key={index} className={styles.tournamentItem}>
                              {registration.tournamentId?.name || "-"}
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Shirt Size */}
                  <td data-label="Shirt Size">
                    {player.tournamentRegistrations?.length > 0
                      ? player.tournamentRegistrations.map(
                          (registration, index) => (
                            <div key={index}>
                              {registration.shirtSize || "-"}
                            </div>
                          ),
                        )
                      : "-"}
                  </td>

                  {/* Food Preference */}
                  <td data-label="Food Preference">
                    {player.tournamentRegistrations?.length > 0
                      ? player.tournamentRegistrations.map(
                          (registration, index) => (
                            <div key={index}>
                              {registration.foodPref || "-"}
                            </div>
                          ),
                        )
                      : "-"}
                  </td>

                  {/* Stay */}
                  <td data-label="Stay">
                    {player.tournamentRegistrations?.length > 0
                      ? player.tournamentRegistrations.map(
                          (registration, index) => (
                            <div key={index}>
                              {registration.stay ? "Yes" : "No"}
                            </div>
                          ),
                        )
                      : "-"}
                  </td>

                  {/* Fee Paid */}
                  <td data-label="Fee Paid">
                    {player.tournamentRegistrations?.length > 0
                      ? player.tournamentRegistrations.map(
                          (registration, index) => (
                            <div key={index}>
                              {registration.feePaid ? "Yes" : "No"}
                            </div>
                          ),
                        )
                      : "-"}
                  </td>

                  {/* Transaction Details */}
                  <td data-label="Transaction Details">
                    {player.tournamentRegistrations?.length > 0
                      ? player.tournamentRegistrations.map(
                          (registration, index) => (
                            <div key={index}>
                              {registration.transactionDetails || "-"}
                            </div>
                          ),
                        )
                      : "-"}
                  </td>

                  {/* Fee Paid Admin */}
                  <td data-label="Fee Paid Admin">
                    {player.feePaidAdmin ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NormalPlayers;
