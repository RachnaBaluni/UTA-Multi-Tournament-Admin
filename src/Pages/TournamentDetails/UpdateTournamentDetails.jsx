import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import styles from "./UpdateTournamentDetails.module.css";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const UpdateTournamentDetails = () => {
  const { tournamentId } = useParams();

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  // ============================
  // FETCH TOURNAMENT DETAILS
  // ============================
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

  // ============================
  // CREATE
  // ============================
  const handleCreate = () => {
    setSelectedDetail(null);
    setIsModalOpen(true);
  };

  // ============================
  // EDIT
  // ============================
  const handleEdit = (detail) => {
    setSelectedDetail(detail);
    setIsModalOpen(true);
  };

  // ============================
  // DELETE
  // ============================
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

  // ============================
  // MODAL CLOSE
  // ============================
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDetail(null);
    fetchDetails();
  };

  return (
    <div className={styles.updateDetails}>
      {/* ============================
          HEADER
      ============================ */}

      <div className={styles.header}>
        <h1>Tournament Details</h1>

        <button className={styles.createButton} onClick={handleCreate}>
          <FiPlus />
          Create Detail
        </button>
      </div>

      {/* ============================
          LOADING
      ============================ */}

      {loading ? (
        <p className={styles.message}>Loading...</p>
      ) : details.length === 0 ? (
        <p className={styles.message}>No tournament details found.</p>
      ) : (
        /* ============================
           DETAILS TABLE
        ============================ */

        <div className={styles.tableContainer}>
          <table className={styles.detailsTable}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Title</th>
                <th>Value</th>
                <th>Rules</th>
                <th>Date</th>
                <th>Showing</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {details.map((detail) => (
                <tr key={detail._id}>
                  <td data-label="Key">{detail.key || "-"}</td>

                  <td data-label="Title">{detail.title || "-"}</td>

                  <td data-label="Value">
                    <div className={styles.valueCell}>
                      {detail.value || "-"}
                    </div>
                  </td>

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

                  <td data-label="Date">
                    {detail.date
                      ? new Date(detail.date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td data-label="Showing">{detail.showing ? "Yes" : "No"}</td>

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

      {/* ============================
          MODAL
      ============================ */}

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
    showing: detail?.showing ?? true,
  });

  // ============================
  // FORM CHANGE
  // ============================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ============================
  // SUBMIT
  // ============================

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
          {/* KEY */}

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

          {/* TITLE */}

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

          {/* VALUE */}

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

          {/* RULES */}

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

          {/* SHOWING */}

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

          {/* BUTTONS */}

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
