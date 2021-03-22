import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHotkeys } from 'react-hotkeys-hook';
import ReactFlow, { addEdge, Background, Elements, removeElements, Edge, Connection } from 'react-flow-renderer';

import { initialElements } from './initialElements';
import customNode from './customNodes';
import "./App.css"

const onLoad = (reactFlowInstance: { fitView: () => void; }) => {
    console.log('flow loaded:', reactFlowInstance);
    reactFlowInstance.fitView();
};
const nodeTypes = {
    exampleNode: customNode,
};

const OverviewFlow = () => {
    const [elements, setElements] = useState(initialElements);
    useHotkeys('delete', () => console.log("Delete pressed"));
    const onElementsRemove = (elementsToRemove: Elements) : void => {
        setElements((elements: Elements) => removeElements(elementsToRemove, elements));
        console.log('elements:', elements);
    }
    const onConnect = (edgeParas: Edge|Connection) : void => {
        setElements((elements: Elements) => addEdge(edgeParas, elements));
        console.log('elements:', elements);
    }

    useEffect(() => {
        axios
            .get("http://localhost:8004/api/Model/all")
            .then(response => console.log(response.data));
    }, []);

    return (
        <div className="diagram-container">
            <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                onLoad={onLoad}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                deleteKeyCode={46}
                snapToGrid={true}
                snapGrid={[25, 25]}
            >
                <Background
                    gap={25}
                    size={1}
                />
            </ReactFlow>
        </div>
    );
};

export default OverviewFlow;