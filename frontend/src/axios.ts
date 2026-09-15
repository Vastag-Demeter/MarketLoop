import axios from "axios";

const api = axios.create({
  baseURL: "https://webshop-backend-tkqv.onrender.com/",
  withCredentials: true,
});

export default api;
