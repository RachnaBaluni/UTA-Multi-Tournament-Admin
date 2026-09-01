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

  // ============================
  // TOURNAMENT DETAILS
  // ============================

  const [tournamentDetails, setTournamentDetails] = useState([]);

  // ============================
  // PRIZES & BENEFITS
  // ============================

  const [prizesBenefits, setPrizesBenefits] = useState([]);

  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  // ============================
  // TYPE CHANGE
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

  // =========================================================
  // TOURNAMENT DETAILS
  // =========================================================

  const addTournamentDetail = () => {
    setTournamentDetails((prev) => [
      ...prev,
      {
        key: "",
        title: "",
        value: "",
        date: "",
        rules: "",
        showing: true,
      },
    ]);
  };

  const handleDetailChange = (index, e) => {
    const { name, value, type, checked } = e.target;

    setTournamentDetails((prev) =>
      prev.map((detail, i) =>
        i === index
          ? {
              ...detail,
              [name]: type === "checkbox" ? checked : value,
            }
          : detail,
      ),
    );
  };

  const removeTournamentDetail = (index) => {
    setTournamentDetails((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================================
  // PRIZES & BENEFITS
  // =========================================================

  const addPrizeBenefit = () => {
    setPrizesBenefits((prev) => [
      ...prev,
      {
        key: "",
        value: "",
        date: "",
        rules: "",
        showing: true,
      },
    ]);
  };

  const handlePrizeChange = (index, e) => {
    const { name, value, type, checked } = e.target;

    setPrizesBenefits((prev) =>
      prev.map((prize, i) =>
        i === index
          ? {
              ...prize,
              [name]: type === "checkbox" ? checked : value,
            }
          : prize,
      ),
    );
  };

  const removePrizeBenefit = (index) => {
    setPrizesBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

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

      // =========================================================
      // 1. CREATE TOURNAMENT
      // =========================================================

      const tournamentResponse = await axios.post(
        `${BACKEND}/api/tournaments`,
        formData,
        {
          withCredentials: true,
        },
      );

      if (!tournamentResponse.data.success) {
        throw new Error("Tournament creation failed.");
      }

      const createdTournament = tournamentResponse.data.data;

      const tournamentId = createdTournament._id;

      // =========================================================
      // 2. CREATE TOURNAMENT DETAILS
      // =========================================================

      for (const detail of tournamentDetails) {
        if (!detail.key.trim() || !detail.value.trim()) {
          continue;
        }

        await axios.post(
          `${BACKEND}/api/tournament-details`,
          {
            tournamentId,
            key: detail.key.trim(),
            title: detail.title.trim(),
            value: detail.value,
            date: detail.date,
            rules: detail.rules
              .split("\n")
              .map((rule) => rule.trim())
              .filter((rule) => rule !== ""),
            showing: detail.showing,
          },
          {
            withCredentials: true,
          },
        );
      }

      // =========================================================
      // 3. CREATE PRIZES & BENEFITS
      // =========================================================

      for (const prize of prizesBenefits) {
        if (!prize.key.trim() || !prize.value.trim()) {
          continue;
        }

        await axios.post(
          `${BACKEND}/api/prices-benifit`,
          {
            tournamentId,
            key: prize.key.trim(),
            value: prize.value,
            date: prize.date,
            rules: prize.rules
              .split("\n")
              .map((rule) => rule.trim())
              .filter((rule) => rule !== ""),
            showing: prize.showing,
          },
          {
            withCredentials: true,
          },
        );
      }

      // =========================================================
      // SUCCESS
      // =========================================================

      setMessage("Tournament created successfully.");

      // =========================================================
      // RESET
      // =========================================================

      setTournamentType("");

      setTournamentDetails([]);
      setPrizesBenefits([]);

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
    } catch (error) {
      console.error("Error creating tournament:", error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Unable to create tournament.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Tournament</h1>

      {/* =====================================================
          STEP 1 - TOURNAMENT TYPE
      ===================================================== */}

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

      {/* =====================================================
          MAIN FORM
      ===================================================== */}

      {tournamentType && (
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* =================================================
              TOURNAMENT TYPE
          ================================================= */}

          <div className={styles.formGroup}>
            <label>Tournament Type</label>

            <select value={tournamentType} onChange={handleTypeChange}>
              <option value="normal">Master Tournament</option>
              <option value="display">Display Tournament</option>
            </select>
          </div>

          {/* =================================================
              TOURNAMENT NAME
          ================================================= */}

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

          {/* =================================================
              DESCRIPTION
          ================================================= */}

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

          {/* =================================================
              DISPLAY TOURNAMENT DATE
          ================================================= */}

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

          {/* =================================================
              LOCATION
          ================================================= */}

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

          {/* =================================================
              ORGANIZER
          ================================================= */}

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

          {/* =================================================
              NORMAL TOURNAMENT FIELDS
          ================================================= */}

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

              {/* REGISTRATION DATES */}

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

              {/* DIRECTOR */}

              <div className={styles.formGroup}>
                <label>Director</label>

                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  placeholder="Enter tournament director"
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
            </>
          )}

          {/* =================================================
              TOURNAMENT DETAILS SECTION
          ================================================= */}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Tournament Details</h2>

              <button
                type="button"
                className={styles.createButton}
                onClick={addTournamentDetail}
              >
                + Add Tournament Detail
              </button>
            </div>

            {tournamentDetails.map((detail, index) => (
              <div className={styles.detailBox} key={index}>
                <div className={styles.detailHeader}>
                  <h3>Tournament Detail {index + 1}</h3>

                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => removeTournamentDetail(index)}
                  >
                    Remove
                  </button>
                </div>

                {/* KEY */}

                <div className={styles.formGroup}>
                  <label>Key</label>

                  <input
                    type="text"
                    name="key"
                    value={detail.key}
                    onChange={(e) => handleDetailChange(index, e)}
                    placeholder="Example: entry_rules"
                  />
                </div>

                {/* TITLE */}

                <div className={styles.formGroup}>
                  <label>Title</label>

                  <input
                    type="text"
                    name="title"
                    value={detail.title}
                    onChange={(e) => handleDetailChange(index, e)}
                    placeholder="Example: Entry Rules"
                  />
                </div>

                {/* VALUE */}

                <div className={styles.formGroup}>
                  <label>Value</label>

                  <textarea
                    name="value"
                    value={detail.value}
                    onChange={(e) => handleDetailChange(index, e)}
                    placeholder="Enter tournament detail"
                    rows="5"
                  />
                </div>

                {/* DATE */}

                <div className={styles.formGroup}>
                  <label>Date</label>

                  <input
                    type="date"
                    name="date"
                    value={detail.date}
                    onChange={(e) => handleDetailChange(index, e)}
                  />
                </div>

                {/* RULES */}

                <div className={styles.formGroup}>
                  <label>Rules</label>

                  <textarea
                    name="rules"
                    value={detail.rules}
                    onChange={(e) => handleDetailChange(index, e)}
                    placeholder="Enter one rule per line"
                    rows="5"
                  />
                </div>

                {/* SHOWING */}

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="showing"
                      checked={detail.showing}
                      onChange={(e) => handleDetailChange(index, e)}
                    />
                    Showing
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* =================================================
              PRIZES & BENEFITS SECTION
          ================================================= */}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Prizes & Benefits</h2>

              <button
                type="button"
                className={styles.createButton}
                onClick={addPrizeBenefit}
              >
                + Add Prize & Benefit
              </button>
            </div>

            {prizesBenefits.map((prize, index) => (
              <div className={styles.detailBox} key={index}>
                <div className={styles.detailHeader}>
                  <h3>Prize & Benefit {index + 1}</h3>

                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => removePrizeBenefit(index)}
                  >
                    Remove
                  </button>
                </div>

                {/* KEY */}

                <div className={styles.formGroup}>
                  <label>Key</label>

                  <input
                    type="text"
                    name="key"
                    value={prize.key}
                    onChange={(e) => handlePrizeChange(index, e)}
                    placeholder="Example: prize_money"
                  />
                </div>

                {/* VALUE */}

                <div className={styles.formGroup}>
                  <label>Prize & Benefit Details</label>

                  <textarea
                    name="value"
                    value={prize.value}
                    onChange={(e) => handlePrizeChange(index, e)}
                    placeholder="Enter prize and benefit details"
                    rows="6"
                  />
                </div>

                {/* DATE */}

                <div className={styles.formGroup}>
                  <label>Date</label>

                  <input
                    type="date"
                    name="date"
                    value={prize.date}
                    onChange={(e) => handlePrizeChange(index, e)}
                  />
                </div>

                {/* RULES */}

                <div className={styles.formGroup}>
                  <label>Rules / Benefits</label>

                  <textarea
                    name="rules"
                    value={prize.rules}
                    onChange={(e) => handlePrizeChange(index, e)}
                    placeholder="Enter one item per line"
                    rows="6"
                  />
                </div>

                {/* SHOWING */}

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="showing"
                      checked={prize.showing}
                      onChange={(e) => handlePrizeChange(index, e)}
                    />
                    Showing
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            className={styles.createButton}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Tournament"}
          </button>

          {/* SUCCESS */}

          {message && <p className={styles.success}>{message}</p>}

          {/* ERROR */}

          {error && <p className={styles.error}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default CreateTournament;
