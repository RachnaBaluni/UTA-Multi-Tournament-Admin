import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api";
import styles from "./RegistrationFields.module.css";

const RegistrationFields = () => {
  const { tournamentId } = useParams();

  const [fields, setFields] = useState({
    shirtSize: true,
    foodPreference: true,
    accommodation: true,
    feePaid: true,
    transactionDetails: true,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchTournamentFields = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/tournaments/${tournamentId}`,
          {
            withCredentials: true,
          },
        );

        const tournament = res.data.data;
        setFields({
          shirtSize: tournament.registrationFields?.shirtSize ?? true,
          foodPreference: tournament.registrationFields?.foodPreference ?? true,
          accommodation: tournament.registrationFields?.accommodation ?? true,
          feePaid: tournament.registrationFields?.feePaid ?? true,
          transactionDetails:
            tournament.registrationFields?.transactionDetails ?? true,
        });
      } catch (error) {
        console.error("Error fetching tournament fields:", error);
      }
    };

    if (tournamentId) {
      fetchTournamentFields();
    }
  }, [tournamentId]);
  const handleChange = (key) => {
    setFields((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const handleSave = async () => {
    try {
      setMessage("");
      setError("");

      const res = await api.put(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/tournaments/${tournamentId}`,
        {
          registrationFields: fields,
        },
        {
          withCredentials: true,
        },
      );

      console.log(res.data);

      setMessage("Registration fields updated successfully.");

      //  message automatically hide after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.log(error);

      setError("Error updating registration fields.");

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  return (
    <div className={styles.container}>
      <h1>Manage Registration Fields</h1>
      <div className={styles.fields}>
        {[
          ["shirtSize", "Shirt Size"],
          ["foodPreference", "Food Preference"],
          ["accommodation", "Accommodation"],
          ["feePaid", "Fee Paid"],
          ["transactionDetails", "Transaction Details"],
        ].map(([key, label]) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={fields[key]}
              onChange={() => handleChange(key)}
            />
            {label}
          </label>
        ))}
      </div>
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <button onClick={handleSave}>Save</button>{" "}
    </div>
  );
};

export default RegistrationFields;
