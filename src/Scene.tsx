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

import { Handle } from 'react-flow-renderer';
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
            let data = event.dataTransfer.getData('application/reactflow').split(' ');
            const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });

            let newNode:Node;
            if (data[0]=='imgnode') {
                data[0]='default';
                 newNode = {
                    id: getId(),
                    type: data[0],
                    position,
                    data: {label: `${data[0]} node`},
                    style: {
                        backgroundImage: data[1],
                        height: Number(data[2]),
                        width: Number(data[3]),
                        padding: 0,
                    }
                };
            }
            else{
                newNode = {
                    id: getId(),
                    type: data[0],
                    position,
                    data: {label: `${data[0]} node`},
                };
            }

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