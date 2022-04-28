import axios from 'axios';

let socialApi = axios.create({
    baseURL: 'http://34.125.238.158:4000/api'
    //baseURL: 'http://localhost:4000/api',
});

export default socialApi;