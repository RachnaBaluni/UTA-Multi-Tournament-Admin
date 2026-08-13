import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

import {
  FiGrid,
  FiCalendar,
  FiUsers,
  FiUser,
  FiSettings,
  FiCheckCircle,
  FiX,
  FiChevronDown,
  FiBarChart2,
  FiGitMerge,
  FiClipboard,
  FiEdit,
} from "react-icons/fi";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isNissanOpen, setIsNissanOpen] = useState(false);
  const [isTournamentsOpen, setIsTournamentsOpen] = useState(false);
  const [tournaments, setTournaments] = useState([]);

  const location = useLocation();

  // ============================
  // FETCH TOURNAMENTS
  // ============================
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/tournaments`,
        );

        const data = await response.json();

        if (data.success) {
          setTournaments(data.data);
        }
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    fetchTournaments();
  }, []);

  // ============================
  // ACTIVE STATES
  // ============================
  const isNissanActive = location.pathname.startsWith("/nissan");

  // ============================
  // TOGGLE FUNCTIONS
  // ============================
  const toggleNissanMenu = () => {
    setIsNissanOpen(!isNissanOpen);
  };

  const toggleTournamentsMenu = () => {
    setIsTournamentsOpen(!isTournamentsOpen);
  };

  return (
    <div
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      {/* ============================
          LOGO
      ============================ */}
      <div className={styles.logo}>
        <h2>UTA Admin</h2>

        <button onClick={toggleSidebar} className={styles.closeButton}>
          <FiX />
        </button>
      </div>

      <ul>
        {/* ============================
            DASHBOARD
        ============================ */}
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={toggleSidebar}
          >
            <FiGrid className={styles.icon} />
            Dashboard
          </NavLink>
        </li>

        {/* ============================
            MAIN EVENTS
        ============================ */}
        <li>
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={toggleSidebar}
          >
            <FiCalendar className={styles.icon} />
            Main Events
          </NavLink>
        </li>

        {/* ============================
            TOURNAMENTS
        ============================ */}
        <li className={styles.collapsible}>
          <div
            className={styles.collapsibleHeader}
            onClick={toggleTournamentsMenu}
          >
            <FiCalendar className={styles.icon} />

            <span>Manage Tournaments</span>

            <FiChevronDown
              className={`${styles.chevron} ${
                isTournamentsOpen ? styles.rotate : ""
              }`}
            />
          </div>

          {isTournamentsOpen && (
            <ul className={styles.submenu}>
              {/* CREATE TOURNAMENT */}
              <li>
                <NavLink
                  to="/tournaments/create"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={toggleSidebar}
                >
                  <FiEdit className={styles.icon} />
                  Create Tournament
                </NavLink>
              </li>

              {/* EDIT / MANAGE TOURNAMENT */}
              <li>
                <NavLink
                  to="/tournaments/edit"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={toggleSidebar}
                >
                  <FiEdit className={styles.icon} />
                  Edit Tournament
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* ============================
            ALL TOURNAMENTS LABEL
        ============================ */}
        <li className={styles.allTournamentsLabel}>ALL TOURNAMENTS</li>

        {/* ============================
            DYNAMIC TOURNAMENTS
        ============================ */}
        {tournaments.map((tournament) => (
          <li className={styles.tournamentItem} key={tournament._id}>
            <div className={styles.collapsibleHeader}>
              <FiCalendar className={styles.icon} />

              <span>{tournament.name}</span>

              <FiChevronDown className={styles.chevron} />
            </div>
          </li>
        ))}

        {/* ============================
            ONGOING TOURNAMENT
        ============================ */}
        <li className={styles.collapsible}>
          <div
            className={`${styles.collapsibleHeader} ${
              isNissanActive ? styles.active : ""
            }`}
            onClick={toggleNissanMenu}
          >
            <FiCalendar className={styles.icon} />

            <span>Ongoing Tournament</span>

            <FiChevronDown
              className={`${styles.chevron} ${
                isNissanOpen ? styles.rotate : ""
              }`}
            />
          </div>

          {isNissanOpen && (
            <ul className={styles.submenu}>
              {/* UPDATE EVENTS */}
              <li>
                <NavLink
                  to="/nissan/update-events"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={toggleSidebar}
                >
                  <FiEdit className={styles.icon} />
                  Update Events
                </NavLink>
              </li>

              {/* REGISTRATION FIELDS */}
              <li>
                <NavLink
                  to="/nissan/registration-fields"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={toggleSidebar}
                >
                  <FiClipboard className={styles.icon} />
                  Manage Registration Fields
                </NavLink>
              </li>

              {/* PLAYER LIST */}
              <li>
                <NavLink
                  to="/nissan/view-player-list"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={toggleSidebar}
                >
                  <FiUsers className={styles.icon} />
                  View Player List
                </NavLink>
              </li>

              {/* TEAM RANKING */}
              <li>
                <NavLink
                  to="/nissan/update-team-ranking"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={toggleSidebar}
                >
                  <FiBarChart2 className={styles.icon} />
                  Update Team Ranking
                </NavLink>
              </li>

              {/* MANAGE DRAW */}
              <li>
                <NavLink
                  to="/nissan/manage-draw"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={toggleSidebar}
                >
                  <FiGitMerge className={styles.icon} />
                  Manage Draw
                </NavLink>
              </li>

              {/* ORDER OF PLAY */}
              <li>
                <NavLink
                  to="/nissan/order-of-play"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={toggleSidebar}
                >
                  <FiCalendar className={styles.icon} />
                  Order of Play
                </NavLink>
              </li>

              {/* MANAGE RESULT */}
              <li>
                <NavLink
                  to="/nissan/manage-result"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={toggleSidebar}
                >
                  <FiGrid className={styles.icon} />
                  Manage Result
                </NavLink>
              </li>

              {/* PLAYER JOURNEY */}
              <li>
                <NavLink
                  to="/nissan/view-player-journey"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={toggleSidebar}
                >
                  <FiUsers className={styles.icon} />
                  View Player Journey
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* ============================
            MEMBERS
        ============================ */}
        <li>
          <NavLink
            to="/members"
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={toggleSidebar}
          >
            <FiUsers className={styles.icon} />
            Members
          </NavLink>
        </li>

        {/* ============================
            APPROVALS
        ============================ */}
        <li>
          <NavLink
            to="/approvals"
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={toggleSidebar}
          >
            <FiCheckCircle className={styles.icon} />
            Approvals
          </NavLink>
        </li>

        {/* ============================
            USERS
        ============================ */}
        <li>
          <NavLink
            to="/users"
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={toggleSidebar}
          >
            <FiUser className={styles.icon} />
            Users
          </NavLink>
        </li>

        {/* ============================
            SETTINGS
        ============================ */}
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={toggleSidebar}
          >
            <FiSettings className={styles.icon} />
            Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
