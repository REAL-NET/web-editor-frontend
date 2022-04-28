import api from './api'

import {Attribute} from "../types";
import {getEdge, getNode} from "./elementRequests";

export const getNodeAttributes = async (modelName: string, id: number) => {
    const node = await getNode(modelName, id);
    if (node !== undefined && node.attributes !== undefined) {
        return node.attributes;
    }
    return undefined;
}

export const getEdgeAttributes = async (modelName: string, id: number) => {
    const edge = await getEdge(modelName, id);
    if (edge !== undefined && edge.attributes !== undefined) {
        return edge.attributes
    }
    return undefined;
}

export const getAttributeValue = async (modelName: string, id: number, attribute: string) => {
    try {
        const response = await api.get(`attribute/${modelName}/${id}/${attribute}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const addAttribute = async (modelName: string, id: number, attribute: string, defaultValue: string) => {
    try {
        const response = await api.post(`attribute/${modelName}/${id}/${attribute}/${defaultValue}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const setAttributeValue = async (modelName: string, id: number, attribute: string, value: string) => {
    try {
        const response = await api.put(`attribute/${modelName}/${id}/${attribute}/${value}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const addNodeAttributes = (modelName: string, id: number) => {
    addAttribute(modelName, id, 'isHidden', 'false');
    addAttribute(modelName, id, 'isDraggable', 'true');
    addAttribute(modelName, id, 'isConnectable', 'true');
}

export const addEdgeAttributes = (modelName: string, id: number) => {
    addAttribute(modelName, id, 'isHidden', 'false');
    addAttribute(modelName, id, 'isAnimated', 'false');
    addAttribute(modelName, id, 'type', 'default');
}