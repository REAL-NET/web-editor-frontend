import api from './api'
import {Elements} from "react-flow-renderer";

import {addAttribute, getAttributeValue, setAttributeValue} from "./attributesRequests";

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
                let xCoordinate = 100 + data.id * 10;
                let yCoordinate = 150 + data.id * 10;
                getAttributeValue(modelName, id, 'xCoordinate').then(attributeData => {
                    if (attributeData === undefined || attributeData.length === 0) {
                        addAttribute(modelName, id, 'xCoordinate', '0').then(() => {
                            setAttributeValue(modelName, id, 'xCoordinate', `${100 + id * 10}`);
                        });
                        addAttribute(modelName, id, 'yCoordinate', '0').then(() => {
                            setAttributeValue(modelName, id, 'yCoordinate', `${150 + id * 10}`);
                        });
                    } else {
                        xCoordinate = attributeData;
                        getAttributeValue(modelName, id, 'yCoordinate').then(attributeData => {
                            yCoordinate = attributeData;
                        });
                    }
                });
                elements.push(
                    {
                        id: `${data.id}`,
                        type: 'robotsNode',
                        data: {label: data.name},
                        position: {x: xCoordinate, y: yCoordinate},
                    }
                );
            }
        })
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
};