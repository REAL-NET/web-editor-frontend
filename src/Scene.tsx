import React, { DragEvent, MouseEvent } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Elements,
    removeElements,
    Edge,
    Connection,
    Controls,
    OnLoadParams,
    ElementId,
    Node,
    FlowElement,
} from 'react-flow-renderer';

import './Scene.css'
import {RepoAPI} from "./repo/RepoAPI";
import {ModelInfo} from "./model/ModelInfo";

let id = 0;
const getId = (): ElementId => `dndnode_${id++}`;

type SceneProps = {
    elements: Elements
    setElements: Function
    reactFlowInstance: OnLoadParams | undefined
    setReactFlowInstance: Function
    setCurrentElementId: Function
    captureElementClick: boolean
}


const Scene: React.FC<SceneProps> = ({ elements, setElements, reactFlowInstance,
                                         setReactFlowInstance, setCurrentElementId, captureElementClick }) => {


    const onElementClick = (_: MouseEvent, element: FlowElement) => {
        console.log('click', element);
        setCurrentElementId(element.id);

    }


    const onDragOver = (event: DragEvent) => {
        console.debug("On drag over")
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };


    const onElementsRemove = (elementsToRemove: Elements): void => {
        console.debug("On elements remove")
        setElements((elements: Elements) => removeElements(elementsToRemove, elements));
        console.log('elements:', elements);
    };

    const onLoad = (_reactFlowInstance: OnLoadParams) => {
        let models = RepoAPI.AllModels();
        if (models !== undefined) {
            let elem = models.find(x => x.name === "TestMetamodel");
            if (elem === undefined) {
                RepoAPI.CreateDeepMetamodel("TestMetamodel");
                RepoAPI.CreateNode("TestMetamodel", "MetaNode1", 0, 0);
                RepoAPI.CreateNode("TestMetamodel", "MetaNode2", 0, 0);
                RepoAPI.CreateModel("TestMetamodel", "TestModel");
                RepoAPI.InstantiateNode("TestModel", "Node1", "MetaNode1", 0, 0);
            }
            console.log(RepoAPI.GetModel("TestMetamodel"));
            console.log(RepoAPI.GetModel("TestModel"));
            console.log(RepoAPI.GetNode("TestModel", "Node1"));
        }
        console.log(models);
        console.log('flow loaded:', reactFlowInstance);
        setReactFlowInstance(_reactFlowInstance);
    };

    const onConnect = (edgeParas: Edge | Connection): void => {
        console.debug("On elements connect")
        setElements((elements: Elements) => addEdge(edgeParas, elements));
        console.log('elements:', elements);
    };


    const onDrop = (event: DragEvent) => {
        console.log("On elements drop")
        event.preventDefault();
        if (reactFlowInstance) {
            const type = event.dataTransfer.getData('application/reactflow');
            const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });
            const newNode: Node = {
                id: getId(),
                type,
                position,
                data: { label: `${ type } node` },
            };

            setElements((es: Elements) => es.concat(newNode));
        }

    };

    return (
        <div className="Scene">
            <ReactFlow
                elements = {elements}
                onElementsRemove={onElementsRemove}
                onLoad={onLoad}
                onConnect={onConnect}
                deleteKeyCode={46}
                snapToGrid={true}
                snapGrid={[25, 25]}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onElementClick={captureElementClick ? onElementClick : undefined}
            >
                <Controls/>
                <Background>
                    gap={25}
                    size={1}
                </Background>
            </ReactFlow>
        </div>
    );
};
export default Scene;