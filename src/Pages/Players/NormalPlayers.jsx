import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NormalPlayers.module.css";

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
    return <div className="loading">Loading players...</div>;
  }

  return (
    <div className="normalPlayers">
      {/* Header */}
      <div className="header">
        <h1>Normal Players</h1>

        <span className="playerCount">{players.length} Players</span>
      </div>

      {/* No Players */}
      {players.length === 0 ? (
        <div className="noPlayers">No normal players found.</div>
      ) : (
        /* Players Table */
        <div className="tableContainer">
          <table className="playersTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>WhatsApp Number</th>
                <th>Date of Birth</th>
                <th>City</th>
              </tr>
            </thead>

            <tbody>
              {players.map((player) => (
                <tr key={player._id}>
                  <td data-label="Name">{player.name || "-"}</td>

                  <td data-label="Email">{player.email || "-"}</td>

                  <td data-label="WhatsApp Number">
                    {player.whatsappNumber || "-"}
                  </td>

                  <td data-label="Date of Birth">
                    {player.dob
                      ? new Date(player.dob).toLocaleDateString()
                      : "-"}
                  </td>

                  <td data-label="City">{player.city || "-"}</td>
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
