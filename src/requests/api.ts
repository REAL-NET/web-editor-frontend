import axios from 'axios';

export default axios.create({
    baseURL: 'http://web:5000'
});