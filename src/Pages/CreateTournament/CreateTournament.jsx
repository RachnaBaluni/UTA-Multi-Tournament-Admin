import React, { useState } from "react";
import axios from "axios";
import styles from "./CreateTournament.module.css";

const CreateTournament = () => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    status: "Upcoming",
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
          startDate: "",
          endDate: "",
          status: "Upcoming",
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

        <div className={styles.formGroup}>
          <label>Status</label>

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Upcoming">Upcoming</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

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
