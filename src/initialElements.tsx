import React from 'react';
import {Elements, FlowElement} from 'react-flow-renderer';
import {RepoAPI} from "./repo/RepoAPI";

function getElements() : Elements {
    const model = RepoAPI.GetModel("TestModel");
    if (model !== undefined) {
        const nodes = model.nodes.map((value, index) => {
            return {
                id: value.name,
                type: 'default',
                data: {
                    label: value.name
                },
                position: { x: 100, y: 60 * index}
            }
        }) as Array<FlowElement>;
        const edges = model.relationships.map(value => {
            const currentRelationship = RepoAPI.GetRelationship("TestModel", value.name);
            if (currentRelationship !== undefined) {
                return {
                    id: currentRelationship.name,
                    source: currentRelationship.source.name,
                    target: currentRelationship.target.name,
                    label: currentRelationship.name
                }
            }
            return undefined
        }).filter(value => value !== undefined) as Array<FlowElement>;
        return [...nodes, ...edges];
    }
    return [];
}

let initialElements : Elements = getElements();

export {initialElements};