import {Elements, FlowElement} from 'react-flow-renderer';
import {RepoAPI} from "./repo/RepoAPI";
import {GeneralizationEdgeStyle, GeneralizationEdgeType, GeneralizationMetatype} from "./Constants";

const getElements = (modelName: string) : Elements => {
    const model = RepoAPI.GetModel(modelName);
    if (model !== undefined) {
        const nodes = model.nodes.map((value, index) => {
            return {
                id: value.name,
                type: 'default',
                data: {
                    label: value.name
                },
                position: { x: 100, y: 60 * index }
            }
        }) as Array<FlowElement>;
        const edges = model.relationships.map(value => {
            const currentRelationship = RepoAPI.GetRelationship(modelName, value.name);
            if (currentRelationship !== undefined) {
                let edge = {
                    id: currentRelationship.name,
                    source: currentRelationship.source.name,
                    target: currentRelationship.target.name,
                    label: currentRelationship.name
                };
                if (currentRelationship.type === GeneralizationMetatype) {
                    return  {
                        ...edge,
                        type: GeneralizationEdgeType,
                        style: GeneralizationEdgeStyle
                    }
                }
                return edge;

            }
            return undefined
        }).filter(value => value !== undefined) as Array<FlowElement>;
        return [...nodes, ...edges];
    }
    return [];
}

export  {getElements};