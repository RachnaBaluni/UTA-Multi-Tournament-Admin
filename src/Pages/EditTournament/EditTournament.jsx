import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EditTournament.module.css";

const EditTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingTournament, setEditingTournament] = useState(null);

  const [tournamentDetails, setTournamentDetails] = useState([]);
  const [prizesBenefits, setPrizesBenefits] = useState([]);
  const [venue, setVenue] = useState({
    key: "",
    value: "",
    date: "",
    rules: "",
    showing: true,
  });

  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  // =========================================================
  // FETCH TOURNAMENTS
  // =========================================================

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

      setError(error.response?.data?.message || "Unable to fetch tournaments.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH TOURNAMENT DETAILS
  // =========================================================

  const fetchTournamentDetails = async (tournamentId) => {
    try {
      const response = await axios.get(
        `${BACKEND}/api/tournament-details?tournamentId=${tournamentId}`,
      );

      if (response.data.success) {
        const details = response.data.data || [];

        setTournamentDetails(
          details.map((detail) => ({
            _id: detail._id,
            key: detail.key || "",
            title: detail.title || "",
            value: detail.value || "",
            date: detail.date
              ? new Date(detail.date).toISOString().slice(0, 10)
              : "",
            rules: Array.isArray(detail.rules)
              ? detail.rules.join("\n")
              : detail.rules || "",
            showing: detail.showing !== false,
          })),
        );
      } else {
        setTournamentDetails([]);
      }
    } catch (error) {
      console.error("Error fetching tournament details:", error);

      setTournamentDetails([]);
    }
  };

  // =========================================================
  // FETCH PRIZES & BENEFITS
  // =========================================================

  const fetchPrizesBenefits = async (tournamentId) => {
    try {
      const response = await axios.get(
        `${BACKEND}/api/prices-benifit?tournamentId=${tournamentId}`,
      );

      if (response.data.success) {
        const prizes = response.data.data || [];

        setPrizesBenefits(
          prizes.map((prize) => ({
            _id: prize._id,
            key: prize.key || "",
            value: prize.value || "",
            date: prize.date
              ? new Date(prize.date).toISOString().slice(0, 10)
              : "",
            rules: Array.isArray(prize.rules)
              ? prize.rules.join("\n")
              : prize.rules || "",
            showing: prize.showing !== false,
          })),
        );
      } else {
        setPrizesBenefits([]);
      }
    } catch (error) {
      console.error("Error fetching prizes and benefits:", error);

      setPrizesBenefits([]);
    }
  };
  const fetchVenue = async (tournamentId) => {
    try {
      const response = await axios.get(
        `${BACKEND}/api/venue?tournamentId=${tournamentId}`,
      );

      if (response.data.success) {
        const venues = response.data.data || [];

        if (venues.length > 0) {
          const firstVenue = venues[0];

          setVenue({
            _id: firstVenue._id,
            key: firstVenue.key || "",
            value: firstVenue.value || "",
            date: firstVenue.date
              ? new Date(firstVenue.date).toISOString().slice(0, 10)
              : "",
            rules: Array.isArray(firstVenue.rules)
              ? firstVenue.rules.join("\n")
              : firstVenue.rules || "",
            showing: firstVenue.showing !== false,
          });
        } else {
          setVenue({
            key: "",
            value: "",
            date: "",
            rules: "",
            showing: true,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching venue:", error);

      setVenue({
        key: "",
        value: "",
        date: "",
        rules: "",
        showing: true,
      });
    }
  };

  const handleVenueChange = (e) => {
    const { name, value, type, checked } = e.target;

    setVenue((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  const handleEdit = async (tournament) => {
    try {
      setError("");
      setMessage("");

      setEditingTournament({
        ...tournament,
        type: "normal",
      });

      setTournamentDetails([]);
      setPrizesBenefits([]);

      await Promise.all([
        fetchTournamentDetails(tournament._id),
        fetchPrizesBenefits(tournament._id),
        fetchVenue(tournament._id),
      ]);
    } catch (error) {
      console.error("Error opening tournament:", error);

      setError("Unable to load tournament details.");
    }
  };

  // =========================================================
  // TOURNAMENT DETAIL FUNCTIONS
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

  const removeTournamentDetail = async (index) => {
    const detail = tournamentDetails[index];

    if (detail._id) {
      try {
        await axios.delete(`${BACKEND}/api/tournament-details/${detail._id}`, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Error deleting tournament detail:", error);

        setError(
          error.response?.data?.message ||
            "Unable to remove tournament detail.",
        );

        return;
      }
    }

    setTournamentDetails((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================================
  // PRIZES & BENEFITS FUNCTIONS
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

  const removePrizeBenefit = async (index) => {
    const prize = prizesBenefits[index];

    if (prize._id) {
      try {
        await axios.delete(`${BACKEND}/api/prices-benifit/${prize._id}`, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Error deleting prize and benefit:", error);

        setError(
          error.response?.data?.message ||
            "Unable to remove prize and benefit.",
        );

        return;
      }
    }

    setPrizesBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================================
  // UPDATE TOURNAMENT
  // =========================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingTournament) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      // =====================================================
      // DATE VALIDATION
      // =====================================================

      if (
        editingTournament.registrationStartDate &&
        editingTournament.registrationEndDate &&
        editingTournament.registrationEndDate <
          editingTournament.registrationStartDate
      ) {
        setError("Registration end date cannot be before start date.");
        setSaving(false);
        return;
      }

      if (
        editingTournament.startDate &&
        editingTournament.endDate &&
        editingTournament.endDate < editingTournament.startDate
      ) {
        setError("Tournament end date cannot be before start date.");
        setSaving(false);
        return;
      }

      // =====================================================
      // 1. UPDATE MASTER TOURNAMENT
      // =====================================================

      const tournamentResponse = await axios.put(
        `${BACKEND}/api/tournaments/${editingTournament._id}`,
        {
          name: editingTournament.name,
          description: editingTournament.description,
          location: editingTournament.location,
          organizer: editingTournament.organizer,

          startDate: editingTournament.startDate,
          endDate: editingTournament.endDate,

          director: editingTournament.director,
          directorPhone: editingTournament.directorPhone,

          status: editingTournament.status || "Upcoming",
          type: "normal",

          registrationStartDate: editingTournament.registrationStartDate || "",

          registrationEndDate: editingTournament.registrationEndDate || "",
        },
        {
          withCredentials: true,
        },
      );

      if (!tournamentResponse.data.success) {
        throw new Error("Tournament update failed.");
      }

      // =====================================================
      // 2. UPDATE / CREATE TOURNAMENT DETAILS
      // =====================================================

      for (const detail of tournamentDetails) {
        if (!detail.key.trim() || !detail.value.trim()) {
          continue;
        }

        const detailPayload = {
          tournamentId: editingTournament._id,
          key: detail.key.trim(),
          title: detail.title.trim(),
          value: detail.value.trim(),
          date: detail.date || new Date(),
          rules: detail.rules
            .split("\n")
            .map((rule) => rule.trim())
            .filter((rule) => rule !== ""),
          showing: detail.showing,
        };

        if (detail._id) {
          await axios.put(
            `${BACKEND}/api/tournament-details/${detail._id}`,
            detailPayload,
            {
              withCredentials: true,
            },
          );
        } else {
          await axios.post(`${BACKEND}/api/tournament-details`, detailPayload, {
            withCredentials: true,
          });
        }
      }

      // =====================================================
      // 3. UPDATE / CREATE PRIZES & BENEFITS
      // =====================================================

      for (const prize of prizesBenefits) {
        if (!prize.key.trim() || !prize.value.trim()) {
          continue;
        }

        const prizePayload = {
          tournamentId: editingTournament._id,
          key: prize.key.trim(),
          value: prize.value.trim(),
          date: prize.date || new Date(),
          rules: prize.rules
            .split("\n")
            .map((rule) => rule.trim())
            .filter((rule) => rule !== ""),
          showing: prize.showing,
        };

        if (prize._id) {
          await axios.put(
            `${BACKEND}/api/prices-benifit/${prize._id}`,
            prizePayload,
            {
              withCredentials: true,
            },
          );
        } else {
          await axios.post(`${BACKEND}/api/prices-benifit`, prizePayload, {
            withCredentials: true,
          });
        }
      }

      // =====================================================
      // 4. UPDATE / CREATE VENUE
      // =====================================================

      if (venue.key.trim() && venue.value.trim()) {
        const venuePayload = {
          tournamentId: editingTournament._id,
          key: venue.key.trim(),
          value: venue.value.trim(),
          date: venue.date || new Date(),
          rules: venue.rules
            .split("\n")
            .map((rule) => rule.trim())
            .filter((rule) => rule !== ""),
          showing: venue.showing,
        };

        if (venue._id) {
          await axios.put(`${BACKEND}/api/venue/${venue._id}`, venuePayload, {
            withCredentials: true,
          });
        } else {
          await axios.post(`${BACKEND}/api/venue`, venuePayload, {
            withCredentials: true,
          });
        }
      }
      // =====================================================
      // SUCCESS
      // =====================================================

      setMessage("Master Tournament updated successfully.");

      setEditingTournament(null);
      setTournamentDetails([]);
      setPrizesBenefits([]);

      await fetchTournaments();
    } catch (error) {
      console.error("Error updating tournament:", error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Unable to update tournament.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE TOURNAMENT
  // =========================================================

  const handleDelete = async () => {
    if (!editingTournament) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tournament?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await axios.delete(
        `${BACKEND}/api/tournaments/${editingTournament._id}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setEditingTournament(null);
        setTournamentDetails([]);
        setPrizesBenefits([]);

        await fetchTournaments();
      }
    } catch (error) {
      console.error("Error deleting tournament:", error);

      setError(error.response?.data?.message || "Unable to delete tournament.");
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Tournament</h1>

      {/* =====================================================
          EDIT FORM
      ===================================================== */}

      {editingTournament && (
        <form className={styles.editForm} onSubmit={handleUpdate}>
          {/* =================================================
              TOURNAMENT TYPE
          ================================================= */}

          <div className={styles.formGroup}>
            <label>Tournament Type</label>

            <input type="text" value="Master Tournament" disabled readOnly />
          </div>

          {/* =================================================
              PERSONAL DETAILS
          ================================================= */}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Personal Details</h2>
                <p>Basic information about the tournament</p>
              </div>
            </div>

            {/* TOURNAMENT NAME */}

            <div className={styles.formGroup}>
              <label>Tournament Name</label>

              <input
                type="text"
                value={editingTournament.name || ""}
                onChange={(e) =>
                  setEditingTournament({
                    ...editingTournament,
                    name: e.target.value,
                  })
                }
                placeholder="Enter tournament name"
                required
              />
            </div>

            {/* DESCRIPTION */}

            <div className={styles.formGroup}>
              <label>Description</label>

              <textarea
                value={editingTournament.description || ""}
                onChange={(e) =>
                  setEditingTournament({
                    ...editingTournament,
                    description: e.target.value,
                  })
                }
                placeholder="Enter tournament description"
                rows="4"
                required
              />
            </div>

            {/* LOCATION */}

            <div className={styles.formGroup}>
              <label>Location</label>

              <input
                type="text"
                value={editingTournament.location || ""}
                onChange={(e) =>
                  setEditingTournament({
                    ...editingTournament,
                    location: e.target.value,
                  })
                }
                placeholder="Enter tournament location"
                required
              />
            </div>

            {/* ORGANIZER */}

            <div className={styles.formGroup}>
              <label>Organizer</label>

              <input
                type="text"
                value={editingTournament.organizer || ""}
                onChange={(e) =>
                  setEditingTournament({
                    ...editingTournament,
                    organizer: e.target.value,
                  })
                }
                placeholder="Enter organizer name"
                required
              />
            </div>

            {/* TOURNAMENT DATES */}

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Tournament Start Date</label>

                <input
                  type="date"
                  value={
                    editingTournament.startDate
                      ? new Date(editingTournament.startDate)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      startDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Tournament End Date</label>

                <input
                  type="date"
                  value={
                    editingTournament.endDate
                      ? new Date(editingTournament.endDate)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      endDate: e.target.value,
                    })
                  }
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
                  value={
                    editingTournament.registrationStartDate
                      ? new Date(editingTournament.registrationStartDate)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      registrationStartDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Registration End Date</label>

                <input
                  type="date"
                  value={
                    editingTournament.registrationEndDate
                      ? new Date(editingTournament.registrationEndDate)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      registrationEndDate: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* DIRECTOR */}

            <div className={styles.formGroup}>
              <label>Tournament Director</label>

              <input
                type="text"
                value={editingTournament.director || ""}
                onChange={(e) =>
                  setEditingTournament({
                    ...editingTournament,
                    director: e.target.value,
                  })
                }
                placeholder="Enter tournament director"
                required
              />
            </div>

            {/* DIRECTOR PHONE */}

            <div className={styles.formGroup}>
              <label>Director Phone Number</label>

              <input
                type="tel"
                value={editingTournament.directorPhone || ""}
                onChange={(e) =>
                  setEditingTournament({
                    ...editingTournament,
                    directorPhone: e.target.value,
                  })
                }
                placeholder="Enter 10 digit phone number"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
            </div>

            {/* STATUS */}

            <div className={styles.formGroup}>
              <label>Status</label>

              <select
                value={editingTournament.status || "Upcoming"}
                onChange={(e) =>
                  setEditingTournament({
                    ...editingTournament,
                    status: e.target.value,
                  })
                }
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* =================================================
              TOURNAMENT DETAILS
          ================================================= */}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Tournament Details</h2>
                <p>Add all tournament related details</p>
              </div>

              <button
                type="button"
                className={styles.addButton}
                onClick={addTournamentDetail}
              >
                + Add Tournament Detail
              </button>
            </div>

            {tournamentDetails.length === 0 && (
              <div className={styles.emptySection}>
                <p>No tournament details added yet.</p>

                <span>Click on "+ Add Tournament Detail" to add details.</span>
              </div>
            )}

            {tournamentDetails.map((detail, index) => (
              <div className={styles.detailBox} key={detail._id || index}>
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

                <div className={styles.formGroup}>
                  <label>Date</label>

                  <input
                    type="date"
                    name="date"
                    value={detail.date}
                    onChange={(e) => handleDetailChange(index, e)}
                  />
                </div>

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

                <div className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="showing"
                    checked={detail.showing}
                    onChange={(e) => handleDetailChange(index, e)}
                  />

                  <label>Showing</label>
                </div>
              </div>
            ))}
          </div>

          {/* =================================================
              PRIZES & BENEFITS
          ================================================= */}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Prizes & Benefits</h2>
                <p>Add prize and benefits information</p>
              </div>

              <button
                type="button"
                className={styles.addButton}
                onClick={addPrizeBenefit}
              >
                + Add Prize & Benefit
              </button>
            </div>

            {prizesBenefits.length === 0 && (
              <div className={styles.emptySection}>
                <p>No prizes or benefits added yet.</p>

                <span>
                  Click on "+ Add Prize & Benefit" to add information.
                </span>
              </div>
            )}

            {prizesBenefits.map((prize, index) => (
              <div className={styles.detailBox} key={prize._id || index}>
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

                <div className={styles.formGroup}>
                  <label>Date</label>

                  <input
                    type="date"
                    name="date"
                    value={prize.date}
                    onChange={(e) => handlePrizeChange(index, e)}
                  />
                </div>

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

                <div className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="showing"
                    checked={prize.showing}
                    onChange={(e) => handlePrizeChange(index, e)}
                  />

                  <label>Showing</label>
                </div>
              </div>
            ))}
          </div>

          {/* =================================================
    VENUE
================================================= */}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Venue</h2>
                <p>Manage venue information for this tournament</p>
              </div>
            </div>

            <div className={styles.detailBox}>
              <div className={styles.formGroup}>
                <label>Venue Name</label>

                <input
                  type="text"
                  name="key"
                  value={venue.key}
                  onChange={handleVenueChange}
                  placeholder="Enter venue name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Venue Details</label>

                <textarea
                  name="value"
                  value={venue.value}
                  onChange={handleVenueChange}
                  placeholder="Enter venue details"
                  rows="5"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Venue Date</label>

                <input
                  type="date"
                  name="date"
                  value={venue.date}
                  onChange={handleVenueChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Rules</label>

                <textarea
                  name="rules"
                  value={venue.rules}
                  onChange={handleVenueChange}
                  placeholder="Enter one rule per line"
                  rows="5"
                />
              </div>

              <div className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  name="showing"
                  checked={venue.showing}
                  onChange={handleVenueChange}
                />

                <label>Showing</label>
              </div>
            </div>
          </div>
          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setEditingTournament(null);
                setTournamentDetails([]);
                setPrizesBenefits([]);
                setError("");
                setMessage("");
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              Delete Tournament
            </button>
          </div>

          {message && <p className={styles.success}>{message}</p>}

          {error && <p className={styles.error}>{error}</p>}
        </form>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && <p className={styles.message}>Loading tournaments...</p>}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {!editingTournament && error && <p className={styles.error}>{error}</p>}

      {/* =====================================================
          TOURNAMENT LIST
      ===================================================== */}

      {!loading && !editingTournament && tournaments.length === 0 && (
        <p className={styles.message}>No tournaments found.</p>
      )}

      {!loading && !editingTournament && tournaments.length > 0 && (
        <div className={styles.tournamentList}>
          {tournaments.map((tournament) => (
            <div className={styles.tournamentCard} key={tournament._id}>
              <div>
                <h2>{tournament.name}</h2>

                <p>
                  <strong>Type:</strong> Master Tournament
                </p>

                <p>
                  <strong>Description:</strong> {tournament.description || "-"}
                </p>

                <p>
                  <strong>Location:</strong> {tournament.location || "-"}
                </p>

                <p>
                  <strong>Organizer:</strong> {tournament.organizer || "-"}
                </p>

                <p>
                  <strong>Start:</strong>{" "}
                  {tournament.startDate
                    ? new Date(tournament.startDate).toLocaleDateString()
                    : "-"}
                </p>

                <p>
                  <strong>End:</strong>{" "}
                  {tournament.endDate
                    ? new Date(tournament.endDate).toLocaleDateString()
                    : "-"}
                </p>

                <p>
                  <strong>Director:</strong> {tournament.director || "-"}
                </p>

                <p>
                  <strong>Director Phone:</strong>{" "}
                  {tournament.directorPhone || "-"}
                </p>

                <p>
                  <strong>Status:</strong> {tournament.status || "-"}
                </p>
              </div>

              <button
                className={styles.editButton}
                onClick={() => handleEdit(tournament)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditTournament;
