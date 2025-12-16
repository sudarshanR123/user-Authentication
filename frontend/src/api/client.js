import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default client;
