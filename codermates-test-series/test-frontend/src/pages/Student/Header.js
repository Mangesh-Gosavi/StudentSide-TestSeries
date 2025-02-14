import React from "react";
import { useNavigate } from "react-router-dom";
import user from "../assests/user.png";
import report from "../assests/report.png";
import action from "../assests/action.png";
import book from "../assests/book.png";
import home from "../assests/home.png";

function Header() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
          border: "1px solid rgb(216, 216, 216)",
          alignItems: "center",
          height: "60px",
        }}
      >
        <img style={{ height: "40px", marginLeft: "10px" }} src={home} alt="Home" />
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            <img style={{ height: "25px" }} src={report} alt="Report" />
            <select
              style={{ height: "40px", border: "none" }}
              onChange={(e) => handleNavigate(e.target.value)}
            >
              <option value="/student-dashboard">Test Level Report</option>
              <option value="/userbookmark">BookMarked Questions</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            <img style={{ height: "25px" }} src={action} alt="Action" />
            <select
              style={{ height: "40px", border: "none" }}
              onChange={(e) => handleNavigate(e.target.value)}
            >
              <option value="/myscheduledtest">My Scheduled Tests</option>
              <option value="/reports">Error Reports</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            <img style={{ height: "25px" }} src={book} alt="Book" />
            <select
              style={{ height: "40px", border: "none" }}
              onClick={(e) => handleNavigate(e.target.value)}
            >
              <option value="/studymaterial">Study Material</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "2px", marginRight: "10px", alignItems: "center" }}>
          <img style={{ height: "25px" }} src={user} alt="User" />
          <select
            style={{ height: "40px", width: "150px", border: "none" }}
            onChange={(e) => handleNavigate(e.target.value)}
          >
            <option value="/profile">Shryea</option>
            <option value="/changepassword">Change Password</option>
            <option value="/dashboard">Log Out</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default Header;
