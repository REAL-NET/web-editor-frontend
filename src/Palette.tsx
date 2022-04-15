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
        let newMetamodel: Array<{ id: number, name: string, kind: string }> = [];
        getModel(props.metamodelName).then(data => {
            if (data !== undefined) {
                data.forEach((element: { id: number, name: string }) => {
                    if (element.name !== 'Link') {
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
            }
        }).finally(() => setMetamodel(newMetamodel));
    }, []);

    const PaletteItem = (props: { element: { id: number; name: string, kind: string } }) => {
        return (
            <div className={`${props.element.kind}Node`} key={props.element.id}
                 onDragStart={(event: DragEvent) => onDragStart(event, props.element.kind, props.element.id)} draggable>
                {props.element.kind !== 'materializationPlank' ? props.element.name : ''}
            </div>
        );
    }

    const metamodelFiltered = metamodel.filter((element) => element.name !== '');
    const metamodelElements = metamodelFiltered.map(element => <PaletteItem element={element} key={element.name + element.id} />);

    return (
        <aside>
            <div className="description">Palette</div>
            {metamodelElements}
            {/*Nodes with images*/}
            {/*<ImageNodeList />*/}
        </aside>
    );
};

export default Palette;