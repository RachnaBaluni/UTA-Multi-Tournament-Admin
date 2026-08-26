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
  const [mainEvents, setMainEvents] = useState([]);
  const [openTournaments, setOpenTournaments] = useState({});

  const location = useLocation();

  // ============================
  // FETCH TOURNAMENTS
  // ============================
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [tournamentResponse, eventResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tournaments`),
          fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/events`),
        ]);

        const tournamentData = await tournamentResponse.json();
        const eventData = await eventResponse.json();

        if (tournamentData.success) {
          setTournaments(tournamentData.data);
        }

        if (eventData.success) {
          setMainEvents(eventData.data);
        }
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    };

    fetchSidebarData();
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

  const toggleTournament = (tournamentId) => {
    setOpenTournaments((prev) => ({
      ...prev,
      [tournamentId]: !prev[tournamentId],
    }));
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
            <div
              className={styles.collapsibleHeader}
              onClick={() => toggleTournament(tournament._id)}
            >
              <FiCalendar className={styles.icon} />

              <span>{tournament.name}</span>

              <FiChevronDown
                className={`${styles.chevron} ${
                  openTournaments[tournament._id] ? styles.rotate : ""
                }`}
              />
            </div>

            {openTournaments[tournament._id] && (
              <ul className={styles.submenu}>
                <li>
                  <NavLink
                    to={`/tournament/${tournament._id}/update-events`}
                    onClick={toggleSidebar}
                  >
                    <FiEdit className={styles.icon} />
                    Update Events
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to={`/tournament/${tournament._id}/registration-fields`}
                    onClick={toggleSidebar}
                  >
                    <FiClipboard className={styles.icon} />
                    Manage Registration Fields
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to={`/tournament/${tournament._id}/view-player-list`}
                    onClick={toggleSidebar}
                  >
                    <FiUsers className={styles.icon} />
                    View Player List
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to={`/tournament/${tournament._id}/update-team-ranking`}
                    onClick={toggleSidebar}
                  >
                    <FiBarChart2 className={styles.icon} />
                    Update Team Ranking
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to={`/tournament/${tournament._id}/manage-draw`}
                    onClick={toggleSidebar}
                  >
                    <FiGitMerge className={styles.icon} />
                    Manage Draw
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to={`/tournament/${tournament._id}/order-of-play`}
                    onClick={toggleSidebar}
                  >
                    <FiCalendar className={styles.icon} />
                    Order of Play
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to={`/tournament/${tournament._id}/manage-result`}
                    onClick={toggleSidebar}
                  >
                    <FiGrid className={styles.icon} />
                    Manage Result
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to={`/tournament/${tournament._id}/view-player-journey`}
                    onClick={toggleSidebar}
                  >
                    <FiUsers className={styles.icon} />
                    View Player Journey
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        ))}

        {/* ============================
    MAIN EVENTS - DISPLAY ONLY
============================ */}
        {mainEvents.map((event) => (
          <li className={styles.tournamentItem} key={`main-event-${event._id}`}>
            <NavLink
              to={`/events/${event._id}`}
              className={({ isActive }) => (isActive ? styles.active : "")}
              onClick={toggleSidebar}
            >
              <FiCalendar className={styles.icon} />
              <span>{event.name}</span>
            </NavLink>
          </li>
        ))}

        {/* ============================
            ONGOING TOURNAMENT
        ============================ */}
        <li className={styles.collapsible}>
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
