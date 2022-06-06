import axios from 'axios';

export default axios.create({
    baseURL: 'https://query-editor-posdb-frontend.herokuapp.com' // http://localhost:5000'
});