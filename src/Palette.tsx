import React, {DragEvent, useEffect, useState} from 'react';

import './Palette.css';
import './nodes/QueryNodes.css';
// import './nodes/RobotsModelNode.css';
// import './nodes/Nodes.css'

// import ImageNodeList from './nodes/ImageNodeList';
import {getModel} from './requests/modelRequests';
import {getAttributeValue} from './requests/attributeRequests';

const onDragStart = (event: DragEvent, kind: string, id: number) => {
    event.dataTransfer.setData('application/reactflow', `${kind} ${id}`);
    event.dataTransfer.effectAllowed = 'move';
};

const Palette = (props: { metamodelName: string }) => {
    const [metamodel, setMetamodel] = useState<Array<{ id: number, name: string, kind: string }>>([]);

    useEffect(() => {
        async function getMetamodel() {
            let newMetamodel: Array<{ id: number, name: string, kind: string }> = [];
            const model = await getModel(props.metamodelName)
            if (model !== undefined) {
                model.forEach((element: { id: number, name: string }) => {
                    if (element.name !== 'link' && element.name !== '') {
                        getAttributeValue(props.metamodelName, element.id, 'isAbstract').then(data => {
                            if (!data) {
                                getAttributeValue(props.metamodelName, element.id, 'kind').then(data => {
                                    if (data !== undefined) {
                                        newMetamodel.push({id: element.id, name: element.name, kind: data});
                                    }
                                });
                            }
                        });
                    }
                });
                setMetamodel(newMetamodel);
            }
        }
        getMetamodel();
    }, []);

    const PaletteItem = (props: { element: { id: number; name: string, kind: string } }) => {
        return (
            <div className={`paletteItem ${props.element.kind}Node`} key={props.element.id}
                 onDragStart={(event: DragEvent) => onDragStart(event, props.element.kind, props.element.id)} draggable>
                {props.element.kind !== 'materializationPlank' ? props.element.name : ''}
            </div>
        );
    }

    const operators = metamodel.filter((element) => element.kind === 'operator');
    const reader = metamodel.filter((element) => element.kind === 'reader');
    const operatorInternals = metamodel.filter((element) => element.kind === 'operatorInternals');
    const materializationPlank = metamodel.filter((element) => element.kind === 'materializationPlank');

    const elementsToPalleteItems = (elements: { id: number; name: string, kind: string }[]) => {
        return elements.map(element => {
            return <PaletteItem element={element} key={element.name + element.id} />
        });
    }

    return (
        <aside>
            <div className="description">Palette</div>
            <div className="kindContainer">
                <div className="kindName">Operators</div>
                {elementsToPalleteItems(operators)}
            </div>
            <div className="kindContainer">
                <div className="kindName">Reader</div>
                {elementsToPalleteItems(reader)}
            </div>
            <div className="kindContainer">
                <div className="kindName">Operator internals</div>
                {elementsToPalleteItems(operatorInternals)}
            </div>
            <div className="kindContainer">
                <div className="kindName">Materialization plank</div>
                {elementsToPalleteItems(materializationPlank)}
                {/*Nodes with images*/}
                {/*<ImageNodeList />*/}
            </div>
        </aside>
    );
};

export default Palette;