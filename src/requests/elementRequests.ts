import api from './api'
import {Elements} from 'react-flow-renderer';

import {addAttribute, addEdgeAttributes, addNodeAttributes, getAttributeValue} from './attributeRequests';
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

export const getModelElements = async (modelName: string, nodes: Array<{ id: number, name: string }>, edges: Array<{ id: number, name: string }>): Promise<Elements> => {
    let elements: Elements = [];
    for (let i = 0, length = nodes.length; i < length; ++i) {
        await getNode(modelName, nodes[i].id).then(data => {
            if (data !== undefined) {
                const id: number = +JSON.stringify(data.id);
                Promise.all([getAttributeValue(modelName, id, 'xCoordinate'), getAttributeValue(modelName, id, 'yCoordinate')]).then(attributeValues => {
                    if (attributeValues[0] === undefined || attributeValues[0].length === 0 || attributeValues[1] === undefined || attributeValues[1].length === 0) {
                        addAttribute(modelName, id, 'xCoordinate', '0');
                        addAttribute(modelName, id, 'yCoordinate', '0');
                        elements.push(
                            {
                                id: `${data.id}`,
                                type: 'robotsNode',
                                data: {label: data.name},
                                position: {x: 0, y: 0},
                            }
                        );
                    } else {
                        elements.push(
                            {
                                id: `${data.id}`,
                                type: 'robotsNode',
                                data: {label: data.name},
                                position: {x: attributeValues[0], y: attributeValues[1]},
                            }
                        );
                    }
                });
            }
        });
    }

    for (let i = 0, length = edges.length; i < length; ++i) {
        await getEdge(modelName, edges[i].id).then(data => {
            if (data !== undefined) {
                elements.push(
                    {
                        id: `${data.id}`,
                        source: `${data.from.id}`,
                        target: `${data.to.id}`,
                        label: `${data.name}`
                    }
                );
            }
        })
    }

    return elements;
}

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

export const addNodeElement = async (modelName: string, parentsId: number, type: string, xCoordinate: number, yCoordinate: number) => {
    let id = '';
    let newNode = {
        id: '',
        type: '',
        position: {x: 0, y: 0},
        data: {label: ''},
    }
    await addElement(modelName, parentsId).then((newNodeId: string) => {
        id = newNodeId;
        return Promise.all([getNode(modelName, +newNodeId), addAttribute(modelName, +newNodeId, 'xCoordinate', `${xCoordinate}`),
            addAttribute(modelName, +newNodeId, 'yCoordinate', `${yCoordinate}`)]);
    }).then(data => {
        const nodeName = data[0].name;
        // addNodeAttributes(modelName, +id);
        newNode = {
            id: `${id}`,
            type,
            position: {x: xCoordinate, y: yCoordinate},
            data: {label: `${nodeName}`},
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