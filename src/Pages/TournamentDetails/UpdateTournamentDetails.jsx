import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import styles from "./UpdateTournamentDetails.module.css";
import { FiEdit, FiTrash2, FiPlus, FiX } from "react-icons/fi";

const UpdateTournamentDetails = () => {
  const { tournamentId } = useParams();

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  // =========================================================
  // FETCH DETAILS
  // =========================================================

  const fetchDetails = async () => {
    setLoading(true);

    try {
      const response = await api.get(
        `${BACKEND}/api/tournament-details?tournamentId=${tournamentId}`,
        {
          withCredentials: true,
        },
      );

      if (response.data?.success) {
        setDetails(response.data.data || []);
      } else {
        setDetails([]);
      }
    } catch (error) {
      console.error("Error fetching tournament details:", error);
      setDetails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tournamentId) {
      fetchDetails();
    }
  }, [tournamentId]);

  // =========================================================
  // CREATE
  // =========================================================

  const handleCreate = () => {
    setSelectedDetail(null);
    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (detail) => {
    setSelectedDetail(detail);
    setIsModalOpen(true);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (detailId) => {
    if (
      !window.confirm("Are you sure you want to delete this tournament detail?")
    ) {
      return;
    }

    try {
      await api.delete(`${BACKEND}/api/tournament-details/${detailId}`, {
        withCredentials: true,
      });

      alert("Tournament detail deleted successfully.");

      fetchDetails();
    } catch (error) {
      console.error("Error deleting tournament detail:", error);

      alert(
        error.response?.data?.message || "Unable to delete tournament detail.",
      );
    }
  };

  // =========================================================
  // MODAL CLOSE
  // =========================================================

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDetail(null);
    fetchDetails();
  };

  return (
    <div className={styles.updateDetails}>
      {/* HEADER */}

      <div className={styles.header}>
        <h1>Tournament Details</h1>

        <button className={styles.createButton} onClick={handleCreate}>
          <FiPlus />
          Create Detail
        </button>
      </div>

      {/* LOADING */}

      {loading ? (
        <p className={styles.message}>Loading...</p>
      ) : details.length === 0 ? (
        <p className={styles.message}>No tournament details found.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.detailsTable}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Title</th>
                <th>Value</th>
                <th>Rules</th>
                <th>Prize & Benefits</th>
                <th>Date</th>
                <th>Showing</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {details.map((detail) => (
                <tr key={detail._id}>
                  {/* KEY */}

                  <td data-label="Key">{detail.key || "-"}</td>

                  {/* TITLE */}

                  <td data-label="Title">{detail.title || "-"}</td>

                  {/* VALUE */}

                  <td data-label="Value">
                    <div className={styles.valueCell}>
                      {detail.value || "-"}
                    </div>
                  </td>

                  {/* RULES */}

                  <td data-label="Rules">
                    {Array.isArray(detail.rules) && detail.rules.length > 0 ? (
                      <ul className={styles.rulesList}>
                        {detail.rules.map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* PRIZE BENEFITS */}

                  <td data-label="Prize & Benefits">
                    {Array.isArray(detail.prizeBenefits) &&
                    detail.prizeBenefits.length > 0 ? (
                      <div>
                        {detail.prizeBenefits.map((benefit, index) => (
                          <div key={index} className={styles.prizePreview}>
                            <strong>
                              {benefit.title || "Prize & Benefit"}
                            </strong>

                            <div>{benefit.value || "-"}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* DATE */}

                  <td data-label="Date">
                    {detail.date
                      ? new Date(detail.date).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* SHOWING */}

                  <td data-label="Showing">{detail.showing ? "Yes" : "No"}</td>

                  {/* ACTIONS */}

                  <td data-label="Actions" className={styles.actions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(detail)}
                      title="Edit"
                    >
                      <FiEdit />
                    </button>

                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(detail._id)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}

      {isModalOpen && (
        <TournamentDetailModal
          detail={selectedDetail}
          tournamentId={tournamentId}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

// =========================================================
// MODAL
// =========================================================

const TournamentDetailModal = ({ detail, tournamentId, onClose }) => {
  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  const [formData, setFormData] = useState({
    key: detail?.key || "",

    title: detail?.title || "",

    value: detail?.value || "",

    date: detail?.date ? new Date(detail.date).toISOString().split("T")[0] : "",

    rules: Array.isArray(detail?.rules) ? detail.rules.join("\n") : "",

    prizeBenefits: Array.isArray(detail?.prizeBenefits)
      ? detail.prizeBenefits.map((item) => ({
          title: item.title || "",

          value: item.value || "",

          rules: Array.isArray(item.rules) ? item.rules.join("\n") : "",

          date: item.date
            ? new Date(item.date).toISOString().split("T")[0]
            : "",
        }))
      : [],

    showing: detail?.showing ?? true,
  });

  // =========================================================
  // CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // ADD PRIZE BENEFIT
  // =========================================================

  const addPrizeBenefit = () => {
    setFormData((prev) => ({
      ...prev,

      prizeBenefits: [
        ...prev.prizeBenefits,

        {
          title: "",
          value: "",
          rules: "",
          date: "",
        },
      ],
    }));
  };

  // =========================================================
  // REMOVE PRIZE BENEFIT
  // =========================================================

  const removePrizeBenefit = (index) => {
    setFormData((prev) => ({
      ...prev,

      prizeBenefits: prev.prizeBenefits.filter((_, i) => i !== index),
    }));
  };

  // =========================================================
  // UPDATE PRIZE BENEFIT
  // =========================================================

  const updatePrizeBenefit = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.prizeBenefits];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        prizeBenefits: updated,
      };
    });
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      tournamentId,

      key: formData.key.trim(),

      title: formData.title.trim(),

      value: formData.value,

      date: formData.date,

      rules: formData.rules
        .split("\n")
        .map((rule) => rule.trim())
        .filter((rule) => rule !== ""),

      // =========================================
      // PRIZE BENEFITS
      // =========================================

      prizeBenefits: formData.prizeBenefits.map((item) => ({
        title: item.title.trim(),

        value: item.value,

        rules: item.rules
          .split("\n")
          .map((rule) => rule.trim())
          .filter((rule) => rule !== ""),

        date: item.date || null,
      })),

      showing: formData.showing,
    };

    try {
      if (detail) {
        await api.put(
          `${BACKEND}/api/tournament-details/${detail._id}`,
          dataToSubmit,
          {
            withCredentials: true,
          },
        );
      } else {
        await api.post(`${BACKEND}/api/tournament-details`, dataToSubmit, {
          withCredentials: true,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error saving tournament detail:", error);

      alert(error.response?.data?.message || "Error saving tournament detail.");
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>
          {detail ? "Edit Tournament Detail" : "Create Tournament Detail"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* =================================================
              KEY
          ================================================= */}

          <div className={styles.formGroup}>
            <label>Key</label>

            <input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleChange}
              placeholder="Example: eligibility"
              required
            />
          </div>

          {/* =================================================
              TITLE
          ================================================= */}

          <div className={styles.formGroup}>
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
            />
          </div>

          {/* =================================================
              VALUE
          ================================================= */}

          <div className={styles.formGroup}>
            <label>Value</label>

            <textarea
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="Enter detail value"
              rows="6"
              required
            />
          </div>

          {/* =================================================
              DATE
          ================================================= */}

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

          {/* =================================================
              RULES
          ================================================= */}

          <div className={styles.formGroup}>
            <label>Rules</label>

            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              placeholder={`Enter one rule per line

Example:
Players must register before deadline
Valid UTA membership required
Entry fee must be paid`}
              rows="6"
            />
          </div>

          {/* =================================================
              PRIZE & BENEFITS
          ================================================= */}

          <div className={styles.prizeSection}>
            <div className={styles.prizeHeader}>
              <h3>Prize & Benefits</h3>

              <button
                type="button"
                className={styles.addPrizeButton}
                onClick={addPrizeBenefit}
              >
                <FiPlus />
                Add Prize / Benefit
              </button>
            </div>

            {/* PRIZE ITEMS */}

            {formData.prizeBenefits.length === 0 && (
              <p className={styles.noPrizeText}>
                No prize or benefit added yet.
              </p>
            )}

            {formData.prizeBenefits.map((item, index) => (
              <div key={index} className={styles.prizeItem}>
                <div className={styles.prizeItemHeader}>
                  <strong>Prize / Benefit #{index + 1}</strong>

                  <button
                    type="button"
                    className={styles.removePrizeButton}
                    onClick={() => removePrizeBenefit(index)}
                  >
                    <FiX />
                  </button>
                </div>

                {/* TITLE */}

                <div className={styles.formGroup}>
                  <label>Prize / Benefit Title</label>

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      updatePrizeBenefit(index, "title", e.target.value)
                    }
                    placeholder="Example: Prize Money"
                  />
                </div>

                {/* VALUE */}

                <div className={styles.formGroup}>
                  <label>Prize / Benefit Details</label>

                  <textarea
                    value={item.value}
                    onChange={(e) =>
                      updatePrizeBenefit(index, "value", e.target.value)
                    }
                    placeholder={`Enter prize / benefit details

Example:
Winner - ₹10,000
Runner Up - ₹5,000
Winner Trophy
Runner Up Trophy`}
                    rows="6"
                  />
                </div>

                {/* RULES */}

                <div className={styles.formGroup}>
                  <label>Prize / Benefit Rules</label>

                  <textarea
                    value={item.rules}
                    onChange={(e) =>
                      updatePrizeBenefit(index, "rules", e.target.value)
                    }
                    placeholder={`Enter one rule per line

Example:
Prize will be given after final
Winner must collect trophy`}
                    rows="4"
                  />
                </div>

                {/* DATE */}

                <div className={styles.formGroup}>
                  <label>Prize / Benefit Date</label>

                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) =>
                      updatePrizeBenefit(index, "date", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* =================================================
              SHOWING
          ================================================= */}

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="showing"
                checked={formData.showing}
                onChange={handleChange}
              />
              Showing
            </label>
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className={styles.saveButton}>
              {detail ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTournamentDetails;
