import React from 'react'

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();
  // const token = localStorage.getItem("token");    
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true }); // replace so back won't go here
    }
  }, [navigate]);
  return (
    <div>
      {/* {token && <Navbar/>} */}
      <div>
        <h2 style={{ padding: "20px" }}>Welcome To Job Portal</h2>
      </div>
        {/* <Logout/> */}
    </div>
  )
}
