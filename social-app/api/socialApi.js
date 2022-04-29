import axios from "axios";

const SERVER = process.env.SERVER;

console.log(SERVER)

let socialApi = axios.create({
  baseURL: process.env.API_URL,
  //baseURL: 'http://localhost:4000/api',
});

export default socialApi;
