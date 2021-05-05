import React, {DragEvent, useEffect, useState} from 'react';
import './Palette.css'
import './Nodes.css'
import {getMetamodel} from "./requests/modelRequests";

const onDragStart = (event: DragEvent, nodeType: string, elementName: string) => {
    event.dataTransfer.setData('text/plain', nodeType + ' ' + elementName);
    event.dataTransfer.effectAllowed = 'move';
};

const Palette = (props: { metamodelName: string }) => {
    const [metamodel, setMetamodel] = useState<Array<{ id: number, name: string }>>([]);

    useEffect(() => {
        getMetamodel(props.metamodelName).then(data => {
            let newMetamodel: Array<{ id: number, name: string }> = [];
            data.forEach((element: { id: number, name: string }) => {
                newMetamodel.push(element);
            })
            setMetamodel(newMetamodel);
        });
    }, []);

    const PaletteItem = (props: { element: { id: number; name: string } }) => {
        return (
            <div className="dndnode" key={props.element.id}
                 onDragStart={(event: DragEvent) => onDragStart(event, 'default', props.element.name)} draggable>
                {props.element.name}
            </div>
        );
    }

    const metamodelFiltered = metamodel.filter((element) => element.name !== '');
    const metamodelElements = metamodelFiltered.map(element => <PaletteItem element={element} key={element.name + element.id} />);

    return (
        <aside>
            <div className="description">Palette</div>
            {metamodelElements}
        </aside>
    );
};

export default Palette;