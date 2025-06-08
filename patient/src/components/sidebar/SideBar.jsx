import { NavLink } from "react-router-dom";
import "./sidebar.css";
import { LogOut } from "lucide-react";
import { useAuthContext } from "../../hooks/useAuthContext";

function Sidebar() {
  const { dispatch } = useAuthContext();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem("auth");
  };

  return (
    <div id="nav-bar">
      <input id="nav-toggle" type="checkbox" />
      <div id="nav-header">
        <a id="nav-title" href="https://codepen.io" target="_blank" rel="noopener noreferrer">
          Patient
        </a>
        <hr />
      </div>
      <div id="nav-content">
        <div className="nav-button">
          <i className="fas fa-gem"></i>
          <NavLink to="/">Appointments</NavLink>
        </div>
        <div className="nav-button">
          <i className="fas fa-images"></i>
          <NavLink to="/centers">Centers</NavLink>
        </div>
        <div className="nav-button">
          <i className="fas fa-thumbtack"></i>
          <NavLink to="/doctors">Doctors</NavLink>
        </div>
        <hr />
        <div className="nav-button">
          <i className="fas fa-heart"></i>
          <NavLink to="/exams">Exams</NavLink>
        </div>
        <div className="nav-button">
          <i className="fas fa-chart-line"></i>
          <NavLink to="/radiology">Radiology</NavLink>
        </div>
        <hr />
        <div className="nav-button" onClick={handleLogout}>
          <LogOut className="fas" />
          <span>Logout</span>
        </div>
        <div id="nav-content-highlight"></div>
      </div>
      <input id="nav-footer-toggle" type="checkbox" />
      <div id="nav-footer">
        <div id="nav-footer-heading">
          <div id="nav-footer-avatar">
            <img src="https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547" alt="avatar" />
          </div>
          <div id="nav-footer-titlebox">
            <a id="nav-footer-title" href="https://codepen.io/uahnbu/pens/public" target="_blank" rel="noopener noreferrer">
              uahnbu
            </a>
            <span id="nav-footer-subtitle">Admin</span>
          </div>
          <label htmlFor="nav-footer-toggle">
            <i className="fas fa-caret-up"></i>
          </label>
        </div>
        <div id="nav-footer-content">
          ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
