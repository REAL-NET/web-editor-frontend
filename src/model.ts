import axios from 'axios';
import api from './api'

let getModel = async () => {
    try {
        const response = await api.get('model/model');
        return response.data.elements;
    } catch (error) {
        console.log(error);
    }
};

let getMetamodel = async () => {
    try {
        const response = await api.get('model/metamodel');
        return response.data.elements;
    } catch (error) {
        console.log(error);
    }
};