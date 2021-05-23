import React, {DragEvent, useEffect, useState} from 'react';

import './Palette.css';
import './RobotsModelNode.css';
import './Nodes.css'

import ImageNodeList from './nodesWithImages/ImageNodeList';
import {getMetamodel} from './requests/modelRequests';
import {getAttributeValue} from './requests/attributesRequests';

const onDragStart = (event: DragEvent, nodeType: string, elementId: number, elementName: string) => {
    event.dataTransfer.setData('application/reactflow', `${nodeType} ${elementId} ${elementName}`);
    event.dataTransfer.effectAllowed = 'move';
};

const Palette = (props: { metamodelName: string }) => {
    const [metamodel, setMetamodel] = useState<Array<{ id: number, name: string }>>([]);

    useEffect(() => {
        let newMetamodel: Array<{ id: number, name: string }> = [];
        getMetamodel(props.metamodelName).then(data => {
            if (data !== undefined) {
                data.forEach((element: { id: number, name: string }) => {
                    getAttributeValue(props.metamodelName, element.id, 'isAbstract').then(data => {
                        if (data !== undefined && !data) {
                            newMetamodel.push(element);
                        }
                    });
                });
            }
        }).finally(() => setMetamodel(newMetamodel));
    }, []);

    const RobotsNodePaletteItem = (props: { element: { id: number; name: string } }) => {
        return (
            <div className="robotsNode" key={props.element.id}
                 onDragStart={(event: DragEvent) => onDragStart(event, 'robotsNode', props.element.id, props.element.name)} draggable>
                {props.element.name}
            </div>
        );
    }

    const metamodelFiltered = metamodel.filter((element) => element.name !== '');
    const metamodelElements = metamodelFiltered.map(element => <RobotsNodePaletteItem element={element} key={element.name + element.id} />);

    return (
        <aside>
            <div className="description">Palette</div>
            {metamodelElements}
            Nodes with images
            <ImageNodeList />
        </aside>
    );
};

export default Palette;