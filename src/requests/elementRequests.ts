import api from './api';

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

export const setElementName = async (modelName: string, id: number, value: string) => {
    try {
        const response = await api.put(`element/${modelName}/${id}/name/${value}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const addElement = async (modelName: string, parentId: number) => {
    try {
        const response = await api.post(`element/${modelName}/${parentId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const setEdgeFromElement = async (modelName: string, edgeId: number, elementId: number | undefined) => {
    try {
        const response = await api.put(`element/${modelName}/${edgeId}/from/${elementId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const setEdgeToElement = async (modelName: string, edgeId: number, elementId: number | undefined) => {
    try {
        const response = await api.put(`element/${modelName}/${edgeId}/to/${elementId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const deleteElement = async (modelName: string, id: number) => {
    try {
        const response = await api.delete(`element/${modelName}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}