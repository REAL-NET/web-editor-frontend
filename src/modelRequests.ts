import api from './api'

export const getModel = async () => {
    try {
        const response = await api.get('model/model');
        return response.data.elements;
    } catch (error) {
        console.log(error);
    }
};

export const getMetamodel = async () => {
    try {
        const response = await api.get('model/metamodel');
        return response.data.elements;
    } catch (error) {
        console.log(error);
    }
};