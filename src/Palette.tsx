import React, {DragEvent} from 'react';
import './Palette.css'
import './Nodes.css'

const onDragStart = (event: DragEvent, nodeType: string, elementName: string) => {
    event.dataTransfer.setData('text/plain', nodeType + ' ' + elementName);
    event.dataTransfer.effectAllowed = 'move';
};

const Palette = (props: { metamodel: Array<{ id: number, name: string }> }) => {
    const PaletteItem = (props: { element: { id: number; name: string } }) => {
        return (
            <div className="dndnode" key={props.element.id}
                 onDragStart={(event: DragEvent) => onDragStart(event, 'default', props.element.name)} draggable>
                {props.element.name}
            </div>
        );
    }

    let metamodel = props.metamodel.filter((element) => element.name !== '');
    let metamodelElements = metamodel.map(element => <PaletteItem element={element} key={element.name + element.id} />);

    return (
        <aside>
            <div className="description">Palette</div>
            {metamodelElements}
        </aside>
    );
};

export default Palette;