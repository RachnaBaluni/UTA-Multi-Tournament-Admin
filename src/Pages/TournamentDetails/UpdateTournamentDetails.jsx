import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import styles from "./UpdateTournamentDetails.module.css";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const UpdateTournamentDetails = () => {
  const { tournamentId } = useParams();

  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  // ============================
  // TOURNAMENT DETAILS
  // ============================

  const [details, setDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(true);

  // ============================
  // PRIZES & BENEFITS
  // ============================

  const [prizes, setPrizes] = useState([]);
  const [prizesLoading, setPrizesLoading] = useState(true);

  // ============================
  // MODAL
  // ============================

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedPrize, setSelectedPrize] = useState(null);

  // =========================================================
  // FETCH TOURNAMENT DETAILS
  // =========================================================

  const fetchDetails = async () => {
    setDetailsLoading(true);

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
      setDetailsLoading(false);
    }
  };

  // =========================================================
  // FETCH PRIZES & BENEFITS
  // =========================================================

  const fetchPrizes = async () => {
    setPrizesLoading(true);

    try {
      const response = await api.get(
        `${BACKEND}/api/prices-benifit?tournamentId=${tournamentId}`,
        {
          withCredentials: true,
        },
      );

      console.log("TOURNAMENT PRIZES & BENEFITS:", response.data);

      if (response.data?.success) {
        setPrizes(response.data.data || []);
      } else {
        setPrizes([]);
      }
    } catch (error) {
      console.error("Error fetching prizes & benefits:", error);

      setPrizes([]);
    } finally {
      setPrizesLoading(false);
    }
  };

  // =========================================================
  // FETCH BOTH
  // =========================================================

  useEffect(() => {
    if (tournamentId) {
      fetchDetails();
      fetchPrizes();
    }
  }, [tournamentId]);

  // =========================================================
  // DETAIL CREATE
  // =========================================================

  const handleCreateDetail = () => {
    setSelectedDetail(null);
    setIsDetailModalOpen(true);
  };

  // =========================================================
  // DETAIL EDIT
  // =========================================================

  const handleEditDetail = (detail) => {
    setSelectedDetail(detail);
    setIsDetailModalOpen(true);
  };

  // =========================================================
  // DETAIL DELETE
  // =========================================================

  const handleDeleteDetail = async (detailId) => {
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
  // PRIZE CREATE
  // =========================================================

  const handleCreatePrize = () => {
    setSelectedPrize(null);
    setIsPrizeModalOpen(true);
  };

  // =========================================================
  // PRIZE EDIT
  // =========================================================

  const handleEditPrize = (prize) => {
    setSelectedPrize(prize);
    setIsPrizeModalOpen(true);
  };

  // =========================================================
  // PRIZE DELETE
  // =========================================================

  const handleDeletePrize = async (prizeId) => {
    if (
      !window.confirm("Are you sure you want to delete this prize & benefit?")
    ) {
      return;
    }

    try {
      await api.delete(`${BACKEND}/api/prices-benifit/${prizeId}`, {
        withCredentials: true,
      });

      alert("Prize & benefit deleted successfully.");

      fetchPrizes();
    } catch (error) {
      console.error("Error deleting prize & benefit:", error);

      alert(
        error.response?.data?.message || "Unable to delete prize & benefit.",
      );
    }
  };

  // =========================================================
  // CLOSE DETAIL MODAL
  // =========================================================

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDetail(null);
    fetchDetails();
  };

  // =========================================================
  // CLOSE PRIZE MODAL
  // =========================================================

  const closePrizeModal = () => {
    setIsPrizeModalOpen(false);
    setSelectedPrize(null);
    fetchPrizes();
  };

  return (
    <div className={styles.updateDetails}>
      {/* =====================================================
          TOURNAMENT DETAILS
      ===================================================== */}

      <div className={styles.header}>
        <h1>Tournament Details</h1>

        <button className={styles.createButton} onClick={handleCreateDetail}>
          <FiPlus />
          Create Detail
        </button>
      </div>

      {detailsLoading ? (
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
                      onClick={() => handleEditDetail(detail)}
                    >
                      <FiEdit />
                    </button>

                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteDetail(detail._id)}
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

      {/* =====================================================
          PRIZES & BENEFITS
      ===================================================== */}

      <div className={styles.header} style={{ marginTop: "50px" }}>
        <h1>Prizes & Benefits</h1>

        <button className={styles.createButton} onClick={handleCreatePrize}>
          <FiPlus />
          Add Prize & Benefit
        </button>
      </div>

      {prizesLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : prizes.length === 0 ? (
        <p className={styles.message}>No prizes & benefits found.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.detailsTable}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Rules</th>
                <th>Date</th>
                <th>Showing</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {prizes.map((prize) => (
                <tr key={prize._id}>
                  <td data-label="Key">{prize.key || "-"}</td>

                  <td data-label="Value">
                    <div className={styles.valueCell}>{prize.value || "-"}</div>
                  </td>

                  <td data-label="Rules">
                    {Array.isArray(prize.rules) && prize.rules.length > 0 ? (
                      <ul className={styles.rulesList}>
                        {prize.rules.map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td data-label="Date">
                    {prize.date
                      ? new Date(prize.date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td data-label="Showing">{prize.showing ? "Yes" : "No"}</td>

                  <td data-label="Actions" className={styles.actions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditPrize(prize)}
                    >
                      <FiEdit />
                    </button>

                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeletePrize(prize._id)}
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

      {/* =====================================================
          TOURNAMENT DETAIL MODAL
      ===================================================== */}

      {isDetailModalOpen && (
        <TournamentDetailModal
          detail={selectedDetail}
          tournamentId={tournamentId}
          onClose={closeDetailModal}
        />
      )}

      {/* =====================================================
          PRIZE MODAL
      ===================================================== */}

      {isPrizeModalOpen && (
        <PrizeBenefitModal
          prize={selectedPrize}
          tournamentId={tournamentId}
          onClose={closePrizeModal}
        />
      )}
    </div>
  );
};

// =========================================================
// TOURNAMENT DETAIL MODAL
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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
          <div className={styles.formGroup}>
            <label>Key</label>

            <input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleChange}
              placeholder="Example: entry_rules"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Entry Rules"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Value</label>

            <textarea
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="Enter tournament detail"
              rows="6"
              required
            />
          </div>

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

          <div className={styles.formGroup}>
            <label>Rules</label>

            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              placeholder={`Enter one rule per line`}
              rows="6"
            />
          </div>

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

// =========================================================
// PRIZE & BENEFIT MODAL
// =========================================================

const PrizeBenefitModal = ({ prize, tournamentId, onClose }) => {
  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  const [formData, setFormData] = useState({
    key: prize?.key || "",
    value: prize?.value || "",
    date: prize?.date ? new Date(prize.date).toISOString().split("T")[0] : "",
    rules: Array.isArray(prize?.rules) ? prize.rules.join("\n") : "",
    showing: prize?.showing ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      tournamentId,

      key: formData.key.trim(),

      value: formData.value,

      date: formData.date,

      rules: formData.rules
        .split("\n")
        .map((rule) => rule.trim())
        .filter((rule) => rule !== ""),

      showing: formData.showing,
    };

    try {
      if (prize) {
        await api.put(
          `${BACKEND}/api/prices-benifit/${prize._id}`,
          dataToSubmit,
          {
            withCredentials: true,
          },
        );
      } else {
        await api.post(`${BACKEND}/api/prices-benifit`, dataToSubmit, {
          withCredentials: true,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error saving prize & benefit:", error);

      alert(error.response?.data?.message || "Error saving prize & benefit.");
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>{prize ? "Edit Prize & Benefit" : "Add Prize & Benefit"}</h2>

        <form onSubmit={handleSubmit}>
          {/* KEY */}

          <div className={styles.formGroup}>
            <label>Key</label>

            <input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleChange}
              placeholder="Example: prize_money"
              required
            />
          </div>

          {/* VALUE */}

          <div className={styles.formGroup}>
            <label>Prize & Benefit Details</label>

            <textarea
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder={`Example:
Prize Money
Participant Benefits
Complimentary stay
Breakfast and Lunch
Gift hampers`}
              rows="8"
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
            <label>Rules / Benefits</label>

            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              placeholder={`Enter one item per line
Example:
Winner gets prize money
Runner-up gets prize money
Every participant gets gift hamper`}
              rows="7"
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
              {prize ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTournamentDetails;
