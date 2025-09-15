import {jwtDecode} from "jwt-decode";
//import axios from 'axios';
//const API_URL = import.meta.env.VITE_API_URL;

export const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
/*
    return axios.post(`${API_URL}/user/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        //console.log(res.data)
        return res.data
    })
    .catch(err => {
        console.error(err)
        return err;
    });
*/
};
