import {FlowElement} from 'react-flow-renderer';
import {GeneralizationEdgeStyle, GeneralizationEdgeType, GeneralizationMetatype} from "./Constants";
import {
    AddSimpleAttribute,
    AddSimpleSlot,
    GetAttributes,
    GetRelationship,
    GetSlot,
    GetSlots
} from "./requests/deepElementRequests";
import {GetModel} from "./requests/deepModelRequests";

const getElements = async (modelName: string) => {
    const model = await GetModel(modelName);
    if (model !== undefined) {
        let nodes: FlowElement[] = []
        if (model.nodes !== undefined) {
            nodes = await Promise.all(model.nodes.map(async (value, index) => {
                let xCoordinate = 100;
                let yCoordinate = 120 * index;
                const nodeType = modelName === 'RobotsQRealModel' ? 'robotsQRealNode' : 'default';
                const picture = modelName === 'RobotsQRealModel' ?
                    (await GetSlot(modelName, value.name, 'Image'))?.simpleValue : undefined;
                const nodeStyle = picture !== undefined ? {
                        backgroundImage: `url(${picture})`,
                        width: '50px',
                        height: '50px',
                    } : undefined;
                const node = {
                    id: value.name,
                    type: nodeType,
                    data: {
                        // label: 'value.name'
                        label: ''
                    },
                    position: {x: xCoordinate, y: yCoordinate},
                    style: nodeStyle,
                };

                const attributes = await GetAttributes(modelName, value.name);
                const xCoordinateAttribute = attributes?.filter(attribute => attribute.name === 'xCoordinate');
                const yCoordinateAttribute = attributes?.filter(attribute => attribute.name === 'yCoordinate');

                if (attributes === undefined || (xCoordinateAttribute?.length === 0 && yCoordinateAttribute?.length === 0)) {
                    await AddSimpleAttribute(modelName, value.name, 'xCoordinate', -1, -1);
                    await AddSimpleAttribute(modelName, value.name, 'yCoordinate', -1, -1);
                    await AddSimpleSlot(modelName, value.name, 'xCoordinate', `${xCoordinate}`, -1, -1);
                    await AddSimpleSlot(modelName, value.name, 'yCoordinate', `${yCoordinate}`, -1, -1);
                    return node;
                }
                if (xCoordinateAttribute?.length === 0) {
                    await AddSimpleAttribute(modelName, value.name, 'xCoordinate', -1, -1);
                    await AddSimpleSlot(modelName, value.name, 'xCoordinate', `${xCoordinate}`, -1, -1);
                }
                if (yCoordinateAttribute?.length === 0) {
                    await AddSimpleAttribute(modelName, value.name, 'yCoordinate', -1, -1);
                    await AddSimpleSlot(modelName, value.name, 'yCoordinate', `${yCoordinate}`, -1, -1);
                }

                const slots = await GetSlots(modelName, value.name);
                const xCoordinateSlot = slots?.filter(slot => slot.attribute.name === 'xCoordinate');
                const yCoordinateSlot = slots?.filter(slot => slot.attribute.name === 'yCoordinate');

                if (slots === undefined || (xCoordinateSlot?.length === 0 && yCoordinateSlot?.length === 0)) {
                    await AddSimpleSlot(modelName, value.name, 'xCoordinate', `${xCoordinate}`, -1, -1);
                    await AddSimpleSlot(modelName, value.name, 'yCoordinate', `${yCoordinate}`, -1, -1);
                    return node;
                }

                if (xCoordinateSlot?.length === 0) {
                    await AddSimpleSlot(modelName, value.name, 'xCoordinate', `${xCoordinate}`, -1, -1);
                }
                if (yCoordinateSlot?.length === 0) {
                    await AddSimpleSlot(modelName, value.name, 'yCoordinate', `${yCoordinate}`, -1, -1);
                }

                const xCoord = (await GetSlot(modelName, value.name, 'xCoordinate'))?.simpleValue;
                const yCoord = (await GetSlot(modelName, value.name, 'yCoordinate'))?.simpleValue;
                return {
                    id: value.name,
                    type: nodeType,
                    data: {
                        // label: 'value.name'
                        label: ''
                    },
                    position: {x: xCoord !== undefined ? +xCoord : xCoordinate, y: yCoord !== undefined ? +yCoord : yCoordinate},
                    style: nodeStyle,
                }
            })) as Array<FlowElement>;
        }
        let edges: FlowElement[] = []
        if (model.relationships !== undefined) {
            edges = await Promise.all(model.relationships.map(async value => {
                const currentRelationship = await GetRelationship(modelName, value.name);
                if (currentRelationship !== undefined) {
                    let sourceHandle = '3';
                    let targetHandle = '1';
                    let edge = {
                        id: currentRelationship.name,
                        source: currentRelationship.source.name,
                        sourceHandle: sourceHandle,
                        target: currentRelationship.target.name,
                        targetHandle: targetHandle,
                        label: currentRelationship.name,
                        type: 'smoothstep',
                    };

                    const attributes = await GetAttributes(modelName, value.name);
                    const sourceHandleAttribute = attributes?.filter(attribute => attribute.name === 'sourceHandle');
                    const targetHandleAttribute = attributes?.filter(attribute => attribute.name === 'targetHandle');
                    if (attributes === undefined || (sourceHandleAttribute?.length === 0 && targetHandleAttribute?.length === 0)) {
                        await AddSimpleAttribute(modelName, value.name, 'sourceHandle', -1, -1);
                        await AddSimpleAttribute(modelName, value.name, 'targetHandle', -1, -1);
                        await AddSimpleSlot(modelName, value.name, 'sourceHandle', `${sourceHandle}`, -1, -1);
                        await AddSimpleSlot(modelName, value.name, 'targetHandle', `${targetHandle}`, -1, -1);

                        if (currentRelationship.type === GeneralizationMetatype) {
                            return {
                                ...edge,
                                type: GeneralizationEdgeType,
                                style: GeneralizationEdgeStyle
                            };
                        }
                    }
                    if (sourceHandleAttribute?.length === 0) {
                        await AddSimpleAttribute(modelName, value.name, 'sourceHandle', -1, -1);
                        await AddSimpleSlot(modelName, value.name, 'sourceHandle', `${sourceHandle}`, -1, -1);
                    }
                    if (targetHandleAttribute?.length === 0) {
                        await AddSimpleAttribute(modelName, value.name, 'targetHandle', -1, -1);
                        await AddSimpleSlot(modelName, value.name, 'targetHandle', `${targetHandle}`, -1, -1);
                    }

                    const slots = await GetSlots(modelName, value.name);
                    const sourceHandleSlot = slots?.filter(slot => slot.attribute.name === 'sourceHandle');
                    const targetHandleSlot = slots?.filter(slot => slot.attribute.name === 'targetHandle');

                    if (slots === undefined || (sourceHandleSlot?.length === 0 && targetHandleSlot?.length === 0)) {
                        await AddSimpleSlot(modelName, value.name, 'sourceHandle', `${sourceHandle}`, -1, -1);
                        await AddSimpleSlot(modelName, value.name, 'targetHandle', `${targetHandle}`, -1, -1);
                        if (currentRelationship.type === GeneralizationMetatype) {
                            return {
                                ...edge,
                                type: GeneralizationEdgeType,
                                style: GeneralizationEdgeStyle
                            };
                        }
                        return edge;
                    }

                    if (sourceHandleSlot?.length === 0) {
                        await AddSimpleSlot(modelName, value.name, 'sourceHandle', `${sourceHandle}`, -1, -1);
                    }
                    if (targetHandleSlot?.length === 0) {
                        await AddSimpleSlot(modelName, value.name, 'targetHandle', `${targetHandle}`, -1, -1);
                    }

                    const sourceHand = (await GetSlot(modelName, value.name, 'sourceHandle'))?.simpleValue;
                    const targetHand = (await GetSlot(modelName, value.name, 'targetHandle'))?.simpleValue;
                    edge = {
                        id: currentRelationship.name,
                        source: currentRelationship.source.name,
                        sourceHandle: sourceHand !== undefined ? sourceHand : sourceHandle,
                        target: currentRelationship.target.name,
                        targetHandle: targetHand !== undefined ? targetHand : targetHandle,
                        label: currentRelationship.name,
                        type: 'smoothstep',
                    };
                    if (currentRelationship.type === GeneralizationMetatype) {
                        return {
                            ...edge,
                            type: GeneralizationEdgeType,
                            style: GeneralizationEdgeStyle
                        };
                    }
                    return edge;
                }
                return undefined;
            }).filter(value => value !== undefined)) as Array<FlowElement>;
        }
        return [...nodes, ...edges];
    }
    return [];
}

export {getElements};