import {Elements} from "react-flow-renderer";
import {getEdge, getNode} from './requests/elementRequests';

export const getModelElements = function (modelName: string, nodes: Array<{ id: number, name: string }>, edges: Array<{ id: number, name: string }>): Elements {
    let elements: Elements = [];
    for (let i = 0, len = nodes.length; i < len; ++i) {
        getNode(modelName, nodes[i].id).then(data => {
            elements.push(
                {
                    id: `${data.id}`,
                    type: 'default',
                    data: {label: data.name},
                    position: {x: 200 + data.id * 5, y: 250 + data.id * 5},
                }
            );
        })
    }
    // nodes.forEach(element => {
    //     getNode(modelName, element.id).then(data => {
    //         elements.push(
    //             {
    //                 id: `${data.id}`,
    //                 type: 'default',
    //                 data: {label: data.name},
    //                 position: {x: 400 + element.id * 10, y: 450 + element.id * 10},
    //             }
    //         );
    //     })
    // });
    edges.forEach(element => {
        getEdge(modelName, element.id).then(data => {
            elements.push(
                {
                    id: `${data.id}`,
                    source: `${data.from.id}`,
                    target: `${data.to.id}`,
                    label: `${data.name}`
                }
            );
        })
    });

    return elements;
};