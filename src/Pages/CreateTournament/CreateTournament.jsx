import React, { useState } from "react";
import axios from "axios";
import styles from "./CreateTournament.module.css";

const CreateTournament = () => {
  const [tournamentType, setTournamentType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    organizer: "",
    startDate: "",
    endDate: "",
    director: "",
    directorPhone: "",
    type: "",
    registrationStartDate: "",
    registrationEndDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  // ============================
  // TYPE SELECT
  // ============================
  const handleTypeChange = (e) => {
    const type = e.target.value;

    setTournamentType(type);

    setFormData((prev) => ({
      ...prev,
      type,
    }));

    setMessage("");
    setError("");
  };

  // ============================
  // FORM CHANGE
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // SUBMIT
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      // ============================
      // DATE VALIDATION
      // ============================

      if (
        formData.registrationStartDate &&
        formData.registrationEndDate &&
        formData.registrationEndDate < formData.registrationStartDate
      ) {
        setError("Registration end date cannot be before start date.");
        setLoading(false);
        return;
      }

      if (
        formData.startDate &&
        formData.endDate &&
        formData.endDate < formData.startDate
      ) {
        setError("Tournament end date cannot be before start date.");
        setLoading(false);
        return;
      }

      // ============================
      // CREATE TOURNAMENT
      // ============================

      const response = await axios.post(
        `${BACKEND}/api/tournaments`,
        formData,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setMessage("Tournament created successfully.");

        // ============================
        // RESET FORM
        // ============================

        setTournamentType("");

        setFormData({
          name: "",
          description: "",
          date: "",
          location: "",
          organizer: "",
          startDate: "",
          endDate: "",
          director: "",
          directorPhone: "",
          type: "",
          registrationStartDate: "",
          registrationEndDate: "",
        });
      }
    } catch (error) {
      console.error("Error creating tournament:", error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to create tournament.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Tournament</h1>

      {/* =================================
          STEP 1 - SELECT TOURNAMENT TYPE
      ================================= */}

      {!tournamentType && (
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>Tournament Type</label>

            <select value={tournamentType} onChange={handleTypeChange}>
              <option value="">Select Tournament Type</option>
              <option value="normal">Master Tournament</option>
              <option value="display">Display Tournament</option>
            </select>
          </div>
        </div>
      )}

      {/* =================================
          STEP 2 - TOURNAMENT FORM
      ================================= */}

      {tournamentType && (
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* =================================
              TOURNAMENT TYPE
          ================================= */}

          <div className={styles.formGroup}>
            <label>Tournament Type</label>

            <select value={tournamentType} onChange={handleTypeChange}>
              <option value="normal">Master Tournament</option>
              <option value="display">Display Tournament</option>
            </select>
          </div>

          {/* =================================
              TOURNAMENT NAME
          ================================= */}

          <div className={styles.formGroup}>
            <label>Tournament Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter tournament name"
              required
            />
          </div>

          {/* =================================
              DESCRIPTION
              BOTH TYPES
          ================================= */}

          <div className={styles.formGroup}>
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter tournament description"
              rows="4"
              required
            />
          </div>

          {/* =================================
    DISPLAY TOURNAMENT DATE
================================= */}

          {tournamentType === "display" && (
            <div className={styles.formGroup}>
              <label>Tournament Date</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* =================================
              LOCATION
              BOTH TYPES
          ================================= */}

          <div className={styles.formGroup}>
            <label>Location</label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter tournament location"
              required
            />
          </div>

          {/* =================================
              ORGANIZER
              BOTH TYPES
          ================================= */}

          <div className={styles.formGroup}>
            <label>Organizer</label>

            <input
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              placeholder="Enter organizer name"
              required
            />
          </div>

          {/* =================================
              NORMAL TOURNAMENT EXTRA FIELDS
          ================================= */}

          {tournamentType === "normal" && (
            <>
              {/* START + END DATE */}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Start Date</label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>End Date</label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* =================================
                  REGISTRATION DATES
              ================================= */}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Registration Start Date</label>

                  <input
                    type="date"
                    name="registrationStartDate"
                    value={formData.registrationStartDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Registration End Date</label>

                  <input
                    type="date"
                    name="registrationEndDate"
                    value={formData.registrationEndDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* =================================
                  DIRECTOR PHONE
              ================================= */}

              <div className={styles.formGroup}>
                <label>Director Phone Number</label>

                <input
                  type="tel"
                  name="directorPhone"
                  value={formData.directorPhone}
                  onChange={handleChange}
                  placeholder="Enter director phone number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>
            </>
          )}

          {/* =================================
              SUBMIT BUTTON
          ================================= */}

          <button
            type="submit"
            className={styles.createButton}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Tournament"}
          </button>

          {/* =================================
              SUCCESS MESSAGE
          ================================= */}

          {message && <p className={styles.success}>{message}</p>}

          {/* =================================
              ERROR MESSAGE
          ================================= */}

          {error && <p className={styles.error}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default CreateTournament;
