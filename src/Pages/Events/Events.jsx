import React, { useState, useEffect } from "react";
import api from "../../api";
import styles from "./Events.module.css";
import EventForm from "../../components/EventForm/EventForm";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { useParams } from "react-router-dom";

const Events = () => {
  const { id } = useParams();

  const [mainEvents, setMainEvents] = useState([]);
  const [displayTournament, setDisplayTournament] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ============================
  // FETCH MAIN EVENTS
  // ============================
  const fetchMainEvents = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/main-events`,
        {
          withCredentials: true,
        },
      );

      setMainEvents(res.data.data || []);
    } catch (error) {
      console.error("Error fetching main events:", error);
    }
  };

  // ============================
  // FETCH DISPLAY TOURNAMENT
  // ============================
  const fetchDisplayTournament = async () => {
    if (!id) return;

    try {
      const res = await api.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/tournaments/${id}`,
        {
          withCredentials: true,
        },
      );

      const tournament = res.data.data;

      // Sirf display tournament ko allow karo
      if (tournament?.type === "display") {
        setDisplayTournament(tournament);
      } else {
        setDisplayTournament(null);
      }
    } catch (error) {
      console.error("Error fetching display tournament:", error);
      setDisplayTournament(null);
    }
  };

  // ============================
  // FETCH DATA
  // ============================
  useEffect(() => {
    fetchMainEvents();
    fetchDisplayTournament();
  }, [id]);

  // ============================
  // SAVE MAIN EVENT
  // ============================
  const handleSave = () => {
    setShowForm(false);
    setSelectedEvent(null);
    fetchMainEvents();
  };

  // ============================
  // CANCEL
  // ============================
  const handleCancel = () => {
    setShowForm(false);
    setSelectedEvent(null);
  };

  // ============================
  // DELETE MAIN EVENT
  // ============================
  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(
          `${
            import.meta.env.VITE_APP_BACKEND_URL
          }/api/main-events/delete/${eventId}`,
          {
            withCredentials: true,
          },
        );

        fetchMainEvents();
      } catch (error) {
        console.error("Error deleting main event:", error);
      }
    }
  };

  // ============================
  // DISPLAY TOURNAMENT PAGE
  // ============================
  if (id && displayTournament) {
    return (
      <div className={styles.events}>
        <h1>{displayTournament.name}</h1>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Date</th>
              <th>Location</th>
              <th>Organizer</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td data-label="Name">{displayTournament.name}</td>

              <td data-label="Description">
                {displayTournament.description || "-"}
              </td>

              <td data-label="Date">
                {displayTournament.date
                  ? new Date(displayTournament.date).toLocaleDateString()
                  : "-"}
              </td>

              <td data-label="Location">{displayTournament.location || "-"}</td>

              <td data-label="Organizer">
                {displayTournament.organizer || "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // ============================
  // NORMAL MAIN EVENTS PAGE
  // ============================
  return (
    <div className={styles.events}>
      <h1>Events</h1>

      {/* ADD EVENT ONLY ON /events */}
      {!id && (
        <button
          className={styles.addButton}
          onClick={() => {
            setSelectedEvent(null);
            setShowForm(true);
          }}
        >
          <FiPlus /> Add Event
        </button>
      )}

      {/* EVENT FORM */}
      {showForm && (
        <EventForm
          event={selectedEvent}
          onSave={handleSave}
          onCancel={handleCancel}
          isMainEvent={true}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Date</th>
            <th>Location</th>
            <th>Organizer</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {mainEvents
            .filter((event) => !id || event._id === id)
            .map((event) => (
              <tr key={event._id}>
                <td data-label="Name">{event.name}</td>

                <td data-label="Description">{event.description}</td>

                <td data-label="Date">
                  {new Date(event.date).toLocaleDateString()}
                </td>

                <td data-label="Location">{event.location}</td>

                <td data-label="Organizer">{event.organizer}</td>

                <td data-label="Actions">
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowForm(true);
                    }}
                  >
                    <FiEdit />
                  </button>

                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(event._id)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Events;
