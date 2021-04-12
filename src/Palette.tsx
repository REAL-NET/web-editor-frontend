import React, { DragEvent } from 'react';
import './PropertyBar.css'
import './Nodes.css'
import {RepoAPI} from "./repo/RepoAPI";
const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
};


const Palette = () => {
    let metamodel = RepoAPI.GetModel("TestMetamodel");
    if (metamodel !== undefined) {
        let metaNodes = metamodel.nodes;
        return (
            <aside>
                <div className="description">palette.</div>
                {metaNodes.map(value => {
                    return <div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, 'default')} draggable>
                        {value.name}
                    </div>
                })}
            </aside>
        );
    }
    return (
        <aside>
            <div className="description">palette.</div>
            <div className="dndnode input" onDragStart={(event: DragEvent) => onDragStart(event, 'input')} draggable>
                Input Node
            </div>
            <div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, 'default')} draggable>
                Default Node
            </div>
            <div className="dndnode output" onDragStart={(event: DragEvent) => onDragStart(event, 'output')} draggable>
                Output Node
            </div>
        </aside>
    );
};

export default Palette;