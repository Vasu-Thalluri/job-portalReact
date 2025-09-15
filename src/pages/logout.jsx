import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove JWT token from localStorage/sessionStorage
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");

    // Optionally clear Redux or Context state here

    // Redirect to login
    navigate("/");
  };

  return (
    <button 
      onClick={handleLogout} 
      style={{ padding: "8px 16px", background: "red", color: "white", border: "none", cursor: "pointer", borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}
    >
      Logout
    </button>
    // <span onClick={handleLogout}>Logout</span>
  );
};

export default Logout;
