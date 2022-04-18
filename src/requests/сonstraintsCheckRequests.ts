import api from './api';

export interface ErrorInfo {
    result: boolean,
    errors: Errors
}

export interface Errors {
    code: number,
    ids: {
        id: number
    }
}

export const queryCheck = async (modelName: string) => {
    try {
        const response = await api.get(`constraintsCheck/queryCheck/${modelName}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const queryCheckWithErrorInfo = async (modelName: string) => {
    try {
        const response = await api.get(`constraintsCheck/queryCheckWithErrorInfo/${modelName}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};