import React, { DragEvent } from 'react';
import './PropertyBar.css'
import './Nodes.css'
import ImageNodeList from './nodesWithImages/ImageNodeList';

const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
};


const Palette = () => {
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
            Nodes with images
            <ImageNodeList></ImageNodeList>
        </aside>
    );
};

export default Palette;