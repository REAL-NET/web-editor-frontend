import {Elements} from "react-flow-renderer";
import {getEdge, getNode} from './requests/elementRequests';

export const getModelElements = async (modelName: string, nodes: Array<{ id: number, name: string }>, edges: Array<{ id: number, name: string }>): Promise<Elements> => {
    let elements: Elements = [];
    for (let i = 0, len = nodes.length; i < len; ++i) {
        await getNode(modelName, nodes[i].id).then(data => {
            elements.push(
                {
                    id: `${data.id}`,
                    type: 'default',
                    data: {label: data.name},
                    position: {x: 100 + data.id * 10, y: 150 + data.id * 10},
                }
            );
        })
    }
    for (let i = 0, len = edges.length; i < len; ++i)
    {
        await getEdge(modelName, edges[i].id).then(data => {
            elements.push(
                {
                    id: `${data.id}`,
                    source: `${data.from.id}`,
                    target: `${data.to.id}`,
                    label: `${data.name}`
                }
            );
        })
    }

    return elements;
};