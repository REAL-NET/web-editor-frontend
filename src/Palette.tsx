import React, { DragEvent } from 'react';
import './PropertyBar.css'
import './Nodes.css'

const onDragStart = (event: DragEvent, nodeType: string, elementName: string) => {
    event.dataTransfer.setData('text/plain', nodeType + ' ' + elementName);
    event.dataTransfer.effectAllowed = 'move';
};

const Palette = (props: {metamodel: Array<{ id: number, name: string }>}) => {
    let metamodel = props.metamodel.filter((element) => element.name !== '');
    return (
        <aside>
            <div className='description'>palette.</div>
            {metamodel.map((element) => (
                <div className='dndnode' onDragStart={(event: DragEvent) => onDragStart(event, 'default', element.name)} draggable>
                    {element.name}
                </div>
            ))}
            {/*<div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, 'default')} draggable>*/}
            {/*    Default Node*/}
            {/*</div>*/}
            {/*<div className="dndnode output" onDragStart={(event: DragEvent) => onDragStart(event, 'output')} draggable>*/}
            {/*    Output Node*/}
            {/*</div>*/}
        </aside>
    );
};

export default Palette;