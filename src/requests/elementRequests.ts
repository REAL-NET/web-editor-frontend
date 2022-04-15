import api from './api'

import {addAttribute} from './attributeRequests';
import {getModelEdges} from './modelRequests';

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

export const addNodeElement = async (modelName: string, parentsId: number, kind: string, xCoordinate: number, yCoordinate: number) => {
    let id = '';
    let newNode = {
        id: '',
        type: '',
        className: '',
        position: {x: 0, y: 0},
        data: {label: ''},
        dragHandle: ''
    }
    await addElement(modelName, parentsId).then((newNodeId: string) => {
        id = newNodeId;
        return Promise.all([getNode(modelName, +newNodeId), addAttribute(modelName, +newNodeId, 'xCoordinate', `${xCoordinate}`),
            addAttribute(modelName, +newNodeId, 'yCoordinate', `${yCoordinate}`)]);
        }).then(data => {
        const name = kind !== 'materializationPlank' ? data[0].name : '';
        const dragHandle = kind === 'materializationPlank' ? '.materializationPlankNodeHandle' : '.nodeHandle';
        newNode = {
            id: `${id}`,
            type: `${kind}Node`,
            className: `${kind}Node`,
            position: {x: xCoordinate, y: yCoordinate},
            data: {label: `${name}`},
            dragHandle: dragHandle
        };
    });
    return newNode;
}

export const addEdgeElement = async (metamodelName: string, modelName: string, fromElementId: number, toElementId: number): Promise<string> => {
    let id = '';
    await getModelEdges(metamodelName).then((edges: Array<{id: number, name: string}>) => {
        for (let i = 0, length = edges.length; i < length; ++i) {
            if (edges[i].name === 'Link') {
                return getEdge(metamodelName, edges[i].id)
            }
        }
    }).then((edge: {id: number, name: string}) => {
        return addElement(modelName, edge.id);
    }).then((newEdgeId: string) => {
        setEdgeFromElement(modelName, +newEdgeId, fromElementId);
        setEdgeToElement(modelName, +newEdgeId, toElementId);
        // addEdgeAttributes(modelName, +newEdgeId);
        id = newEdgeId;
    });
    return id;
}

export const deleteElement = async (modelName: string, id: number) => {
    try {
        const response = await api.delete(`element/${modelName}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}