import axios from "axios";

let socialApi = axios.create({
  baseURL: process.env.API_URL,
  //baseURL: 'http://localhost:4000/api',
});

export default socialApi;
