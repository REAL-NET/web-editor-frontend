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
    const [metamodel, setMetamodel] = useState<Array<{ id: number, name: string, kind: string, type: string }>>([]);

    useEffect(() => {
        async function getMetamodel() {
            let newMetamodel: Array<{ id: number, name: string, kind: string, type: string }> = [];
            const model = await getModel(props.metamodelName);
            if (model !== undefined) {
                for (const element of model) {
                    if (element.name !== 'link' && element.name !== '') {
                        const isAbstract = await getAttributeValue(props.metamodelName, element.id, 'isAbstract');
                        if (isAbstract !== undefined && !isAbstract) {
                            const kind = await getAttributeValue(props.metamodelName, element.id, 'kind');
                            if (kind !== undefined) {
                                if (kind === 'operator') {
                                    const type = await getAttributeValue(props.metamodelName, element.id, 'type');
                                    if (type !== undefined) {
                                        newMetamodel.push({id: element.id, name: element.name, kind: kind, type: type});
                                    }
                                } else {
                                    newMetamodel.push({id: element.id, name: element.name, kind: kind, type: ''});
                                }
                            }
                        }
                    }
                }
                setMetamodel(newMetamodel);
            }
        }
        getMetamodel();
    }, []);

    const PaletteItem = (props: { element: { id: number; name: string, kind: string } }) => {
        return (
            <div className={`paletteItem ${props.element.kind}Node`} key={props.element.id}
                 onDragStart={(event: DragEvent) => onDragStart(event, props.element.kind, props.element.id)} draggable>
                {props.element.kind !== 'materializationLine' ? props.element.name : ''}
            </div>
        );
    }

    const positionalOperators = metamodel.filter((element) => element.kind === 'operator' && element.type === 'positional');
    const tupleOperators = metamodel.filter((element) => element.kind === 'operator' && element.type === 'tuple');
    const reader = metamodel.filter((element) => element.kind === 'reader');
    const operatorInternals = metamodel.filter((element) => element.kind === 'operatorInternals');
    const materializationLine = metamodel.filter((element) => element.kind === 'materializationLine');

    const elementsToPaletteItems = (elements: { id: number; name: string, kind: string, type: string }[]) => {
        return elements.map(element => {
            return <PaletteItem element={element} key={element.name + element.id} />
        });
    }

    return (
        <aside>
            <div className="description">Palette</div>
            <div className="kindContainer">
                <div className="kindName">Positional operators</div>
                {elementsToPaletteItems(positionalOperators)}
            </div>
            <div className="kindContainer">
                <div className="kindName">Tuple operators</div>
                {elementsToPaletteItems(tupleOperators)}
            </div>
            <div className="kindContainer">
                <div className="kindName">Reader</div>
                {elementsToPaletteItems(reader)}
            </div>
            <div className="kindContainer">
                <div className="kindName">Operator internals</div>
                {elementsToPaletteItems(operatorInternals)}
            </div>
            <div className="kindContainer">
                <div className="kindName">Materialization Line</div>
                {elementsToPaletteItems(materializationLine)}
                {/*Nodes with images*/}
                {/*<ImageNodeList />*/}
            </div>
        </aside>
    );
};

export default Palette;