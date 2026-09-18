import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MemberPlayers.css";

const MemberPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    const fetchMemberPlayers = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/player/all-players`,
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          setPlayers(response.data.data.memberPlayers || []);
        }
      } catch (error) {
        console.error("Error fetching member players:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberPlayers();
  }, [backendUrl]);

  if (loading) {
    return <div className="loading">Loading member players...</div>;
  }

  return (
    <div className="memberPlayers">
      {/* Header */}
      <div className="header">
        <h1>Member Players</h1>

        <span className="playerCount">{players.length} Players</span>
      </div>

      {/* No Players */}
      {players.length === 0 ? (
        <div className="noPlayers">No member players found.</div>
      ) : (
        <div className="tableContainer">
          <table className="playersTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>City</th>
                <th>Address</th>
                <th>Experience</th>
                <th>Academy</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {players.map((player) => (
                <tr key={player._id}>
                  <td data-label="Name">{player.name || "-"}</td>

                  <td data-label="Email">{player.email || "-"}</td>

                  <td data-label="Phone Number">{player.number || "-"}</td>

                  <td data-label="Gender">{player.gender || "-"}</td>

                  <td data-label="Date of Birth">
                    {player.dob
                      ? new Date(player.dob).toLocaleDateString()
                      : "-"}
                  </td>

                  <td data-label="City">{player.city || "-"}</td>

                  <td data-label="Address">{player.address || "-"}</td>

                  <td data-label="Experience">{player.experience || "-"}</td>

                  <td data-label="Academy">{player.academy || "-"}</td>

                  <td data-label="Status">{player.status || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MemberPlayers;
