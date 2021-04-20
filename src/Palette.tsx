import React, {DragEvent} from 'react';
import './PropertyBar.css'
import './Nodes.css'

const onDragStart = (event: DragEvent, nodeType: string, elementName: string) => {
    event.dataTransfer.setData('text/plain', nodeType + ' ' + elementName);
    event.dataTransfer.effectAllowed = 'move';
};

const Palette = (props: { metamodel: Array<{ id: number, name: string }> }) => {
    let metamodelElements = () => {
        let metamodel = props.metamodel.filter((element) => element.name !== '')

        return metamodel.map((element) => (
            <div className="dndnode" key={element.id}
                 onDragStart={(event: DragEvent) => onDragStart(event, 'default', element.name)} draggable>
                {element.name}
            </div>
        ));
    }

    return (
        <aside>
            <div className="description">palette.</div>
            {metamodelElements()}
        </aside>
    );
};

export default Palette;