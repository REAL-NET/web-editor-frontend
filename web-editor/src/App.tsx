import React, {useState} from 'react';
import ReactFlow, {addEdge, Background, Elements, removeElements, Edge, Connection} from 'react-flow-renderer';
import {initialElements} from './initialElements';
import "./App.css"
import {RepoAPI} from "./repo/RepoAPI";

const onLoad = (reactFlowInstance: { fitView: () => void; }) => {
    RepoAPI.CreateModel("DeepMetamodel", "TestModel")
    console.log(RepoAPI.AllModels());
    console.log(RepoAPI.GetModel("TestModel"))
    console.log('flow loaded:', reactFlowInstance);
    reactFlowInstance.fitView();
};

const OverviewFlow = () => {
    const [elements, setElements] = useState(initialElements);
    const onElementsRemove = (elementsToRemove: Elements) : void => {
        setElements((elements: Elements) => removeElements(elementsToRemove, elements));
        console.log('elements:', elements);
    }
    const onConnect = (edgeParas: Edge|Connection) : void => {
        setElements((elements: Elements) => addEdge(edgeParas, elements));
        console.log('elements:', elements);
    }

    return (
        <div className="diagram-container">
            <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                onLoad={onLoad}
                onConnect={onConnect}
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