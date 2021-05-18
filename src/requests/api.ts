import axios from 'axios';

export default axios.create({
    baseURL: 'https://web:5000'
});