import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Company() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState({ type: "", msg: "" });
  const naviagte = useNavigate();
  useEffect(() => {
    //this functionality for not to show this page while clicking back/forward arrow in browser after logout.
    const token = localStorage.getItem("token");
    if (!token) {
      naviagte("/", { replace: true });
    }
  }, [naviagte]);

  const handleCompany = async (e) => {
    e.preventDefault();
    createCompany();
  };
  const token = localStorage.getItem("token");
  const createCompany = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/company/createCompany`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
      //console.log(data.message)
      if (data) {
        setMessage({ type: "success", msg: data.message });
        setTimeout(() => {
          setMessage({ type: "", msg: "" });
          setName("");
        }, 2000);
      }
      //console.log(res);
    } catch (error) {
      console.log(error);
      if (error.response.data.message.includes("Invalid token or expired")) {
        console.log("hiiiii");
        const errMsg = "Session Timed Out Please Login Again";
        console.log(errMsg);
        setMessage({ type: "error", msg: errMsg });
        setTimeout(() => {
          setMessage({ type: "", msg: "" });
        }, 2000);
      } else {
        const errMsg = error.response?.data.message || "Something went wrong";
        setMessage({ type: "error", msg: errMsg });
        setTimeout(() => {
          setMessage({ type: "", msg: "" });
        }, 2000);
      }
    }
  };
  // setName();

  return (
    <div>
      <h2 style={{ padding: "20px" }}>Company</h2>
      <form
        action=""
        onSubmit={handleCompany}
        style={{ display: "grid", gap: "10px", justifyContent: "center" }}
      >
        <label htmlFor="company">CompanyName:</label>
        <input
          type="text"
          id="company"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="organization"
        />
        {/* <label htmlFor="">TypeOfIndustry:</label>
            <input type="text" name="" id="" style={{justifyContent: 'space-between'}} /> */}
        <button type="submit">Submit</button>
      </form>
      {message.msg && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.msg}
        </p>
      )}
    </div>
  );
}
