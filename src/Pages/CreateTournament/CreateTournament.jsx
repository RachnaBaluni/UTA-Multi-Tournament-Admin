import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import styles from "./CreateTournament.module.css";

const CreateTournament = () => {
  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  const [showTypeSelection, setShowTypeSelection] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    organizer: "",
    startDate: "",
    endDate: "",
    director: "",
    directorPhone: "",
    type: "normal",
    registrationStartDate: "",
    registrationEndDate: "",
    date: "",
  });

  const [details, setDetails] = useState([
    {
      key: "",
      value: "",
      date: "",
      rules: "",
      showing: true,
    },
  ]);

  const [prizes, setPrizes] = useState([
    {
      key: "",
      value: "",
      showing: true,
    },
  ]);

  const [venue, setVenue] = useState({
    key: "",
    value: "",
    date: "",
    rules: "",
    showing: true,
    mapLink: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTypeSelection = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
    }));

    setShowTypeSelection(false);
    setErrors({});
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleDetailChange = (index, field, value) => {
    setDetails((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const addDetail = () => {
    setDetails((prev) => [
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

  const removeDetail = (index) => {
    setDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePrizeChange = (index, field, value) => {
    setPrizes((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const addPrize = () => {
    setPrizes((prev) => [
      ...prev,
      {
        key: "",
        value: "",
        showing: true,
      },
    ]);
  };

  const removePrize = (index) => {
    setPrizes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVenueChange = (field, value) => {
    setVenue((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateMasterTournament = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tournament name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = "Organizer is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Tournament start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Tournament end date is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = "End date cannot be before start date";
    }

    if (!formData.registrationStartDate) {
      newErrors.registrationStartDate = "Registration start date is required";
    }

    if (!formData.registrationEndDate) {
      newErrors.registrationEndDate = "Registration end date is required";
    }

    if (
      formData.registrationStartDate &&
      formData.registrationEndDate &&
      new Date(formData.registrationStartDate) >
        new Date(formData.registrationEndDate)
    ) {
      newErrors.registrationEndDate =
        "Registration end date cannot be before registration start date";
    }

    if (!formData.director.trim()) {
      newErrors.director = "Director is required";
    }

    if (!formData.directorPhone.trim()) {
      newErrors.directorPhone = "Director phone is required";
    }

    if (!venue.key.trim()) {
      newErrors.venueKey = "Venue name is required";
    }

    if (!venue.value.trim()) {
      newErrors.venueValue = "Venue location is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateDisplayTournament = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tournament name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = "Organizer is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      organizer: "",
      startDate: "",
      endDate: "",
      director: "",
      directorPhone: "",
      type: "normal",
      registrationStartDate: "",
      registrationEndDate: "",
      date: "",
    });

    setDetails([
      {
        key: "",
        value: "",
        date: "",
        rules: "",
        showing: true,
      },
    ]);

    setPrizes([
      {
        key: "",
        value: "",
        showing: true,
      },
    ]);

    setVenue({
      key: "",
      value: "",
      date: "",
      rules: "",
      showing: true,
      mapLink: "",
    });

    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setErrors({});

    const isDisplay = formData.type === "display";

    if (isDisplay) {
      if (!validateDisplayTournament()) {
        return;
      }
    } else {
      if (!validateMasterTournament()) {
        return;
      }
    }

    setLoading(true);

    try {
      let tournamentPayload;

      if (isDisplay) {
        tournamentPayload = {
          name: formData.name,
          description: formData.description,
          location: formData.location,
          organizer: formData.organizer,
          date: formData.date,
          type: "display",
        };
      } else {
        const { date, ...masterFormData } = formData;

        tournamentPayload = {
          ...masterFormData,
          type: "normal",
        };
      }

      const token = localStorage.getItem("token");

      const tournamentResponse = await axios.post(
        `${BACKEND}/api/tournaments`,
        tournamentPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const tournamentId =
        tournamentResponse.data?.tournament?._id ||
        tournamentResponse.data?._id ||
        tournamentResponse.data?.data?._id;

      if (!tournamentId) {
        throw new Error("Tournament ID was not returned by backend");
      }

      // Display tournaments only need the tournament itself.
      if (isDisplay) {
        toast.success("Display Tournament created successfully");
        setMessage("Display Tournament created successfully");

        resetForm();
        setShowTypeSelection(true);
        return;
      }

      const validDetails = details.filter(
        (detail) =>
          detail.key.trim() ||
          detail.value.trim() ||
          detail.date ||
          detail.rules.trim(),
      );

      if (validDetails.length > 0) {
        await axios.post(`${BACKEND}/api/tournament-details`, {
          tournamentId,
          details: validDetails,
        });
      }

      const validPrizes = prizes.filter(
        (prize) => prize.key.trim() || prize.value.trim(),
      );

      if (validPrizes.length > 0) {
        await axios.post(`${BACKEND}/api/prices-benifit`, {
          tournamentId,
          prizes: validPrizes,
        });
      }

      await axios.post(`${BACKEND}/api/venue`, {
        tournamentId,
        key: venue.key,
        value: venue.value,
        date: venue.date,
        rules: venue.rules,
        showing: venue.showing,
        mapLink: venue.mapLink,
      });

      toast.success("Master Tournament created successfully");
      setMessage("Master Tournament created successfully");

      resetForm();
      setShowTypeSelection(true);
    } catch (error) {
      console.error("Error creating tournament:", error);

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create tournament";

      setMessage(backendMessage);
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show tournament type selection first.
  if (showTypeSelection) {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.detailBox}>
            <div className={styles.detailHeader}>
              <h2>Choose Tournament Type</h2>
            </div>

            <div className={styles.twoColumnLayout}>
              <button
                type="button"
                className={styles.addButton}
                onClick={() => handleTypeSelection("normal")}
              >
                Master Tournament
              </button>

              <button
                type="button"
                className={styles.addButton}
                onClick={() => handleTypeSelection("display")}
              >
                Display Tournament
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isDisplay = formData.type === "display";

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.detailBox}>
          <div className={styles.detailHeader}>
            <h2>{isDisplay ? "Display Tournament" : "Master Tournament"}</h2>

            <button
              type="button"
              className={styles.addButton}
              onClick={() => {
                resetForm();
                setShowTypeSelection(true);
              }}
            >
              Change Type
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.twoColumnLayout}>
              <div className={styles.formGroup}>
                <label>Tournament Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter tournament name"
                />
                {errors.name && (
                  <span className={styles.error}>{errors.name}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Organizer</label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="Enter organizer name"
                />
                {errors.organizer && (
                  <span className={styles.error}>{errors.organizer}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter tournament location"
                />
                {errors.location && (
                  <span className={styles.error}>{errors.location}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter tournament description"
                />
                {errors.description && (
                  <span className={styles.error}>{errors.description}</span>
                )}
              </div>

              {isDisplay ? (
                <div className={styles.formGroup}>
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                  {errors.date && (
                    <span className={styles.error}>{errors.date}</span>
                  )}
                </div>
              ) : (
                <>
                  <div className={styles.formGroup}>
                    <label>Tournament Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                    {errors.startDate && (
                      <span className={styles.error}>{errors.startDate}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tournament End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                    {errors.endDate && (
                      <span className={styles.error}>{errors.endDate}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Registration Start Date</label>
                    <input
                      type="date"
                      name="registrationStartDate"
                      value={formData.registrationStartDate}
                      onChange={handleChange}
                    />
                    {errors.registrationStartDate && (
                      <span className={styles.error}>
                        {errors.registrationStartDate}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Registration End Date</label>
                    <input
                      type="date"
                      name="registrationEndDate"
                      value={formData.registrationEndDate}
                      onChange={handleChange}
                    />
                    {errors.registrationEndDate && (
                      <span className={styles.error}>
                        {errors.registrationEndDate}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Director</label>
                    <input
                      type="text"
                      name="director"
                      value={formData.director}
                      onChange={handleChange}
                      placeholder="Enter director name"
                    />
                    {errors.director && (
                      <span className={styles.error}>{errors.director}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Director Phone</label>
                    <input
                      type="text"
                      name="directorPhone"
                      value={formData.directorPhone}
                      onChange={handleChange}
                      placeholder="Enter director phone"
                    />
                    {errors.directorPhone && (
                      <span className={styles.error}>
                        {errors.directorPhone}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {!isDisplay && (
              <>
                <div className={styles.detailBox}>
                  <div className={styles.detailHeader}>
                    <h3>Tournament Details</h3>

                    <button
                      type="button"
                      className={styles.addButton}
                      onClick={addDetail}
                    >
                      Add Detail
                    </button>
                  </div>

                  {details.map((detail, index) => (
                    <div className={styles.detailRow} key={index}>
                      <div className={styles.formGroup}>
                        <label>Key</label>
                        <input
                          type="text"
                          value={detail.key}
                          onChange={(e) =>
                            handleDetailChange(index, "key", e.target.value)
                          }
                          placeholder="Enter key"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Value</label>
                        <input
                          type="text"
                          value={detail.value}
                          onChange={(e) =>
                            handleDetailChange(index, "value", e.target.value)
                          }
                          placeholder="Enter value"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Date</label>
                        <input
                          type="date"
                          value={detail.date}
                          onChange={(e) =>
                            handleDetailChange(index, "date", e.target.value)
                          }
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Rules</label>
                        <textarea
                          value={detail.rules}
                          onChange={(e) =>
                            handleDetailChange(index, "rules", e.target.value)
                          }
                          placeholder="Enter rules"
                        />
                      </div>

                      {details.length > 1 && (
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeDetail(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.detailBox}>
                  <div className={styles.detailHeader}>
                    <h3>Prizes & Benefits</h3>

                    <button
                      type="button"
                      className={styles.addButton}
                      onClick={addPrize}
                    >
                      Add Prize
                    </button>
                  </div>

                  {prizes.map((prize, index) => (
                    <div className={styles.detailRow} key={index}>
                      <div className={styles.formGroup}>
                        <label>Key</label>
                        <input
                          type="text"
                          value={prize.key}
                          onChange={(e) =>
                            handlePrizeChange(index, "key", e.target.value)
                          }
                          placeholder="Enter key"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Value</label>
                        <input
                          type="text"
                          value={prize.value}
                          onChange={(e) =>
                            handlePrizeChange(index, "value", e.target.value)
                          }
                          placeholder="Enter value"
                        />
                      </div>

                      {prizes.length > 1 && (
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removePrize(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.detailBox}>
                  <div className={styles.detailHeader}>
                    <h3>Venue</h3>
                  </div>

                  <div className={styles.twoColumnLayout}>
                    <div className={styles.formGroup}>
                      <label>Venue Name</label>
                      <input
                        type="text"
                        value={venue.key}
                        onChange={(e) =>
                          handleVenueChange("key", e.target.value)
                        }
                        placeholder="Enter venue name"
                      />
                      {errors.venueKey && (
                        <span className={styles.error}>{errors.venueKey}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Venue Location</label>
                      <input
                        type="text"
                        value={venue.value}
                        onChange={(e) =>
                          handleVenueChange("value", e.target.value)
                        }
                        placeholder="Enter venue location"
                      />
                      {errors.venueValue && (
                        <span className={styles.error}>
                          {errors.venueValue}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Venue Date</label>
                      <input
                        type="date"
                        value={venue.date}
                        onChange={(e) =>
                          handleVenueChange("date", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Map Link</label>
                      <input
                        type="text"
                        value={venue.mapLink}
                        onChange={(e) =>
                          handleVenueChange("mapLink", e.target.value)
                        }
                        placeholder="Enter Google Maps link"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Venue Rules</label>
                      <textarea
                        value={venue.rules}
                        onChange={(e) =>
                          handleVenueChange("rules", e.target.value)
                        }
                        placeholder="Enter venue rules"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {message && <div className={styles.message}>{message}</div>}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : isDisplay
                  ? "Create Display Tournament"
                  : "Create Master Tournament"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTournament;
