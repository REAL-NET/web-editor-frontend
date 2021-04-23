import api from './api'

export const getEdge = async (modelName: string, id: number) => {
    try {
        const response = await api.get(`element/${modelName}/edge/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getNode = async (modelName: string, id: number) => {
    try {
        const response = await api.get(`element/${modelName}/node/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};