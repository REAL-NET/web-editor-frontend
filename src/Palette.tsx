import React, { DragEvent } from 'react';
import './PropertyBar.css'
import './Nodes.css'

const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
};

const Palette = (props: {metamodel: Array<{ id: number, name: string }>}) => {
    return (
        <aside>
            <div className="description">palette.</div>
            {props.metamodel.map((element) => (
                <div className="dndnode input" onDragStart={(event: DragEvent) => onDragStart(event, 'input')} draggable>
                    {element.name}
                </div>
            ))}
            {/*<div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, 'default')} draggable>*/}
            {/*    Default Node*/}
            {/*</div>*/}
            {/*<div className="dndnode output" onDragStart={(event: DragEvent) => onDragStart(event, 'output')} draggable>*/}
            {/*    Output Node*/}
            {/*</div>*/}
            {console.log('lalala')}
        </aside>
    );
};

export default Palette;