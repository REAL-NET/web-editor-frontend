import {FlowElement} from 'react-flow-renderer';
import {GeneralizationEdgeStyle, GeneralizationEdgeType, GeneralizationMetatype} from "./Constants";
import {
    AddAttribute,
    AddSlot,
    GetAttribute,
    GetAttributes,
    GetRelationship,
    GetSlot, GetSlots
} from "./requests/deepElementRequests";
import {GetModel, GetModelMetaNodes} from "./requests/deepModelRequests";

const getElements = async (modelName: string) => {
    const model = await GetModel(modelName);
    if (model !== undefined) {
        let nodes: FlowElement[] = []
        if (model.nodes !== undefined) {
            nodes = await Promise.all(model.nodes.map(async (value, index) => {
                let xCoordinate = 100;
                let yCoordinate = 60 * index;

                const attributes = await GetAttributes(modelName, value.name);
                const xCoordinateAttribute = attributes?.filter(attribute => attribute.name === 'xCoordinate');
                const yCoordinateAttribute = attributes?.filter(attribute => attribute.name === 'yCoordinate');

                const modelMetaNodes = await GetModelMetaNodes(modelName);
                const availableTypes = [...(model?.nodes || []), ...(modelMetaNodes || [])].map(value => `${value.model.name}::${value.name}`);
                const typeName = availableTypes.find(type => type.indexOf('String') >= 0) || availableTypes[0];
                const sep = typeName.indexOf("::");

                // if (attributes === undefined || (xCoordinateAttribute?.length === 0 && yCoordinateAttribute?.length === 0)) {
                //     await AddAttribute(modelName, value.name, 'xCoordinate', typeName.substr(0, sep), typeName.substr(sep + 2), -1, -1);
                //     await AddAttribute(modelName, value.name, 'yCoordinate', typeName.substr(0, sep), typeName.substr(sep + 2), -1, -1);
                //     await AddSlot(modelName, value.name, 'xCoordinate', `${xCoordinate}`, -1, -1);
                //     await AddSlot(modelName, value.name, 'yCoordinate', `${yCoordinate}`, -1, -1);
                    return {
                        id: value.name,
                        type: 'default',
                        data: {
                            label: value.name
                        },
                        position: {x: xCoordinate, y: yCoordinate}
                    }
                // }

                // if (xCoordinateAttribute?.length === 0) {
                //     await AddAttribute(modelName, value.name, 'xCoordinate', typeName.substr(0, sep), typeName.substr(sep + 2), -1, -1);
                //     await AddSlot(modelName, value.name, 'xCoordinate', `${xCoordinate}`, -1, -1);
                // }
                // if (yCoordinateAttribute?.length === 0) {
                //     await AddAttribute(modelName, value.name, 'yCoordinate', typeName.substr(0, sep), typeName.substr(sep + 2), -1, -1);
                //     await AddSlot(modelName, value.name, 'yCoordinate', `${yCoordinate}`, -1, -1);
                // }
                //
                // const slots = await GetSlots(modelName, value.name);
                // console.log(slots)
                // const xCoordinateSlot = slots?.filter(slot => slot.attribute.name === 'xCoordinate');
                // const yCoordinateSlot = slots?.filter(slot => slot.attribute.name === 'yCoordinate');
                //
                // if (slots === undefined || (xCoordinateSlot?.length === 0 && yCoordinateSlot?.length === 0)) {
                //     console.log('aaa')
                //     console.log(await AddSlot(modelName, value.name, 'xCoordinate', `${xCoordinate}`, -1, -1));
                //     await AddSlot(modelName, value.name, 'yCoordinate', `${yCoordinate}`, -1, -1);
                //     return {
                //         id: value.name,
                //         type: 'default',
                //         data: {
                //             label: value.name
                //         },
                //         position: {x: xCoordinate, y: yCoordinate}
                //     }
                // }
                //
                // if (xCoordinateSlot?.length === 0) {
                //     await AddSlot(modelName, value.name, 'xCoordinate', `${xCoordinate}`, -1, -1);
                // }
                // if (yCoordinateSlot?.length === 0) {
                //     await AddSlot(modelName, value.name, 'yCoordinate', `${yCoordinate}`, -1, -1);
                // }
                //
                // const xCoord = (await GetSlot(modelName, value.name, 'xCoordinate'))?.value;
                // const yCoord = (await GetSlot(modelName, value.name, 'yCoordinate'))?.value;
                // return {
                //     id: value.name,
                //     type: 'default',
                //     data: {
                //         label: value.name
                //     },
                //     position: {x: xCoord, y: yCoord}
                // }
            })) as Array<FlowElement>;
        }
        let edges: FlowElement[] = []
        if (model.relationships !== undefined) {
            edges = await Promise.all(model.relationships.map(async value => {
                const currentRelationship = await GetRelationship(modelName, value.name);
                if (currentRelationship !== undefined) {
                    let edge = {
                        id: currentRelationship.name,
                        source: currentRelationship.source.name,
                        target: currentRelationship.target.name,
                        label: currentRelationship.name
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