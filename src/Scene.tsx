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

import customNode from './customNodes';

import './Scene.css'

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

const nodeTypes = {
    exampleNode: customNode,
};

const Scene: React.FC<SceneProps> = ({ elements, setElements, reactFlowInstance,
                                         setReactFlowInstance, setCurrentElementId, captureElementClick }) => {


    const onElementClick = (_: MouseEvent, element: FlowElement) => {
        console.log('click', element);
        setCurrentElementId(element.id);

    }


    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };


    const onElementsRemove = (elementsToRemove: Elements): void => {
        setElements((elements: Elements) => removeElements(elementsToRemove, elements));
        console.log('elements:', elements);
    };


    const onLoad = (_reactFlowInstance: OnLoadParams) => setReactFlowInstance(_reactFlowInstance);


    const onConnect = (edgeParas: Edge | Connection): void => {
        setElements((elements: Elements) => addEdge(edgeParas, elements));
        console.log('elements:', elements);
    };


    const onDrop = (event: DragEvent) => {

        event.preventDefault();
        if (reactFlowInstance) {
            const type = event.dataTransfer.getData('text').split(' ')[0];
            const name = event.dataTransfer.getData('text').split(' ')[1];
            const position = reactFlowInstance.project({ x: event.clientX - 280, y: event.clientY - 40 });
            const newNode: Node = {
                id: getId(),
                type,
                position,
                data: { label: `${ name }` },
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
                nodeTypes={nodeTypes}
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