import axios from 'axios';

const SERVER = process.env.SERVER;

console.log(SERVER)

let socialApi = axios.create({
    baseURL: SERVER,
    //baseURL: 'http://localhost:4000/api',
});

export default socialApi;