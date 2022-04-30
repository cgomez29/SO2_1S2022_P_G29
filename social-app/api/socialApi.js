import axios from "axios";


let socialApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
  //baseURL: 'http://localhost:4000/api',
});

export default socialApi;
