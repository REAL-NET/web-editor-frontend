import React from 'react';
import { Elements } from 'react-flow-renderer';
import {RepoAPI} from "./repo/RepoAPI";

function getElements() : Elements {
    const model = RepoAPI.GetModel("TestModel");
    if (model !== undefined) {
        const nodes = model.nodes;
        return nodes.map((value, index) => {
            return {
                id: value.name,
                type: 'default',
                data: {
                    label: value.name
                },
                position: { x: 100, y: 60 * index}
            }
        });
    }
    return [];
}

let initialElements : Elements = getElements();

export {initialElements};