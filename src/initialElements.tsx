import {FlowElement} from 'react-flow-renderer';
import {GeneralizationEdgeStyle, GeneralizationEdgeType, GeneralizationMetatype} from "./Constants";
import {GetRelationship} from "./requests/deepElementRequests";
import {GetModel} from "./requests/deepModelRequests";

const getElements = async (modelName: string) => {
    const model = await GetModel(modelName);
    if (model !== undefined) {
        const nodes = model.nodes.map((value, index) => {
            return {
                id: value.name,
                type: 'default',
                data: {
                    label: value.name
                },
                position: {x: 100, y: 60 * index}
            }
        }) as Array<FlowElement>;
        const edges = await Promise.all(model.relationships.map(async value => {
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
        return [...nodes, ...edges];
    }
    return [];
}

export {getElements};