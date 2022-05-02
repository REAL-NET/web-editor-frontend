import React, {DragEvent, useEffect, useState} from 'react';

import './Palette.css';
import './elements/QueryElements.css';
// import './elements/RobotsModelNode.css';
// import './elements/Nodes.css'

// import ImageNodeList from './elements/ImageNodeList';
import {getModel} from './requests/modelRequests';
import {getAttributeValue, getNodeAttributes} from './requests/attributeRequests';

const onDragStart = (event: DragEvent, kind: string, id: number) => {
    event.dataTransfer.setData('application/reactflow', `${kind} ${id}`);
    event.dataTransfer.effectAllowed = 'move';
};

const onDragStartGroup = (event: DragEvent, kind: string, name: string, nodeId: number, groupId: number, childId: number) => {
    event.dataTransfer.setData('application/reactflow', `${kind} ${name} ${nodeId} ${groupId} ${childId}`);
    event.dataTransfer.effectAllowed = 'move';
};

const Palette = (props: { metamodelName: string }) => {
    const [metamodel, setMetamodel] = useState<Array<{ id: number, name: string, kind: string, type: string }>>([]);

    useEffect(() => {
        async function getMetamodel() {
            let newMetamodel: Array<{ id: number, name: string, kind: string, type: string }> = [];
            const model = await getModel(props.metamodelName);
            if (model !== undefined) {
                await Promise.all(model.map(async (element: { id: number, name: string }) => {
                    if (element.name !== 'link' && element.name !== '') {
                        const attributes = await getNodeAttributes(props.metamodelName, element.id);
                        if (attributes !== undefined) {
                            const isAbstractAttribute = attributes.find(attribute => attribute.name === 'isAbstract');
                            const isAbstract = isAbstractAttribute !== undefined ? isAbstractAttribute.stringValue === 'true' : undefined;
                            if (isAbstract !== undefined && !isAbstract) {
                                const kind = attributes.find(attribute => attribute.name === 'kind')?.stringValue;
                                if (kind !== undefined) {
                                    if (kind === 'operator') {
                                        const type = attributes.find(attribute => attribute.name === 'type')?.stringValue;
                                        if (type !== undefined) {
                                            newMetamodel.push({
                                                id: element.id,
                                                name: element.name,
                                                kind: kind,
                                                type: type
                                            });
                                        }
                                    } else {
                                        newMetamodel.push({id: element.id, name: element.name, kind: kind, type: ''});
                                    }
                                }
                            }
                        }
                    }
                }))
                setMetamodel(newMetamodel);
            }
        }

        getMetamodel();
    }, []);

    const PaletteItem = (props: { element: { id: number; name: string, kind: string, type: string } }) => {
        return (
            <div className={`paletteItem ${props.element.kind}Node`} key={props.element.id}
                 onDragStart={(event: DragEvent) => {
                     const kind = props.element.kind;
                     const type = props.element.type;
                     const name = props.element.name;
                     if (kind === 'operator' && type === 'positional' && name !== 'DS' && name !== 'PosAND' && name !== 'PosOR' &&
                         name !== 'PosNOT') {
                         const operatorInternalsId = operatorInternals[0].id;
                         const readerId = reader[0].id;
                         onDragStartGroup(event, props.element.kind, props.element.name, props.element.id, operatorInternalsId, readerId);
                     } else {
                         onDragStart(event, props.element.kind, props.element.id);
                     }
                 }}
                 draggable="true">
                {props.element.kind !== 'materializationLine' ? props.element.name : ''}
            </div>
        );
    }

    const positionalOperators = metamodel.filter((element) => element.kind === 'operator' && element.type === 'positional').sort(
        (x, y) => x.name.localeCompare(y.name));
    const tupleOperators = metamodel.filter((element) => element.kind === 'operator' && element.type === 'tuple').sort(
        (x, y) => x.name.localeCompare(y.name));
    const reader = metamodel.filter((element) => element.kind === 'reader');
    const operatorInternals = metamodel.filter((element) => element.kind === 'operatorInternals');
    const materializationLine = metamodel.filter((element) => element.kind === 'materializationLine');

    const elementsToPaletteItems = (elements: { id: number; name: string, kind: string, type: string }[]) => {
        return elements.map(element => {
            return <PaletteItem element={element} key={element.name + element.id}/>
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