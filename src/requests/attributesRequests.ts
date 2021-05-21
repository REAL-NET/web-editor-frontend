import api from './api'

import {Attribute} from "../Attribute";
import {getEdge, getNode} from "./elementRequests";

export const getNodeAttributes = async (modelName: string, id: number) => {
    let attributes: Array<Attribute> = [];
    await getNode(modelName, id).then(data => {
        if (data.attributes !== undefined) {
            data.attributes.forEach((attribute: Attribute) => {
                attributes.push(attribute);
            });
        }
    });
    return attributes;
}

export const getEdgeAttributes = async (modelName: string, id: number) => {
    let attributes: Array<Attribute> = [];
    await getEdge(modelName, id).then(data => {
        if (data.attributes !== undefined) {
            data.attributes.forEach((attribute: Attribute) => {
                attributes.push(attribute);
            });
        }
    });
    return attributes;
}

export const getAttributeValue = async (modelName: string, id: number, attribute: string) => {
    try {
        const response = await api.get(`attribute/${modelName}/${id}/${attribute}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}