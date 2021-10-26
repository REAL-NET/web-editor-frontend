import api from './api'

export const getModel = async (modelName: string) => {
    try {
        const response = await api.get(`model/${modelName}`);
        return response.data.elements;
    } catch (error) {
        console.log(error);
    }
};

export const getModelNodes = async (modelName: string) => {
    try {
        const response = await api.get(`model/${modelName}`);
        return response.data.nodes;
    } catch (error) {
        console.log(error);
    }
};

export const getModelEdges = async (modelName: string) => {
    try {
        const response = await api.get(`model/${modelName}`);
        return response.data.edges;
    } catch (error) {
        console.log(error);
    }
};