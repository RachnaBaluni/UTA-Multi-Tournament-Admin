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
          shirtSize: tournament.registrationFields?.shirtSize ?? false,
          foodPreference:
            tournament.registrationFields?.foodPreference ?? false,
          accommodation: tournament.registrationFields?.accommodation ?? false,
          feePaid: tournament.registrationFields?.feePaid ?? false,
          transactionDetails:
            tournament.registrationFields?.transactionDetails ?? false,
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
      alert("Registration fields updated successfully");
    } catch (error) {
      console.log(error);
      alert("Error updating registration fields");
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

      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default RegistrationFields;
