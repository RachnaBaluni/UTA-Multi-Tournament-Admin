import React, { useState } from "react";
import axios from "axios";
import styles from "./CreateTournament.module.css";

const CreateTournament = () => {
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
    type: "normal",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await axios.post(
        `${BACKEND}/api/tournaments`,
        formData,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setMessage("Tournament created successfully.");

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
        });
      }
    } catch (error) {
      console.error("Error creating tournament:", error);

      setError(error.response?.data?.message || "Unable to create tournament.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Tournament</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* TOURNAMENT NAME */}
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

        {/* DESCRIPTION */}
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

        {/* DATE */}
        <div className={styles.formGroup}>
          <label>Date</label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* LOCATION */}
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

        {/* ORGANIZER */}
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

        {/* TOURNAMENT TYPE */}
        <div className={styles.formGroup}>
          <label>Tournament Type</label>

          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="normal">Normal Tournament</option>
            <option value="display">Display Tournament</option>
          </select>
        </div>

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

        {/* TOURNAMENT DIRECTOR */}
        <div className={styles.formGroup}>
          <label>Tournament Director</label>

          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            placeholder="Enter tournament director name"
            required
          />
        </div>

        {/* DIRECTOR PHONE */}
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

        {/* SUBMIT */}
        <button
          type="submit"
          className={styles.createButton}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Tournament"}
        </button>

        {message && <p className={styles.success}>{message}</p>}

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default CreateTournament;
