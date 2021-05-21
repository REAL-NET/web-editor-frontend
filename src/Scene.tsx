import React, {DragEvent, MouseEvent} from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Elements,
    removeElements,
    Edge,
    Connection,
    Controls,
    OnLoadParams,
    Node,
    FlowElement,
} from 'react-flow-renderer';

import './Scene.css'

import ImageNode from './nodesWithImages/ImageNode';
import RobotsModelNode from './RobotsModelNode';

type SceneProps = {
    elements: Elements
    setElements: Function
    reactFlowInstance: OnLoadParams | undefined
    setReactFlowInstance: Function
    setCurrentElementId: Function
    captureElementClick: boolean
}

const nodeTypes = {
    robotsNode: RobotsModelNode,
    imageNode: ImageNode,
};

const Scene: React.FC<SceneProps> = ({
                                         elements, setElements, reactFlowInstance,
                                         setReactFlowInstance, setCurrentElementId, captureElementClick
                                     }) => {
    const onElementClick = (_: MouseEvent, element: FlowElement) => {
        setCurrentElementId(element.id);
    }

    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onElementsRemove = (elementsToRemove: Elements): void => {
        setElements((elements: Elements) => removeElements(elementsToRemove, elements));
    };

    const onLoad = (_reactFlowInstance: OnLoadParams) => setReactFlowInstance(_reactFlowInstance);

    const onConnect = (edgeParas: Edge | Connection): void => {
        setElements((elements: Elements) => addEdge(edgeParas, elements));
    };

    let id = 0;
    const getId = function (): string {
        while (elements.find(item => item.id === `${id}`) !== undefined) {
            ++id;
        }
        return `${id}`;
    };

    const onDrop = (event: DragEvent) => {
        event.preventDefault();
        if (reactFlowInstance) {
            const data = event.dataTransfer.getData('application/reactflow').split(' ');
            const type = data[0];
            const position = reactFlowInstance.project({x: event.clientX - 280, y: event.clientY - 40});

            let newNode: Node;
            if (type === 'ImageNode') {
                newNode = {
                    id: getId(),
                    type: 'imageNode',
                    position,
                    data: {label: `${type}`},
                    style: {
                        backgroundImage: data[1],
                        height: Number(data[2]),
                        width: Number(data[3]),
                        border: '1px solid #777',
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: 'center',
                    }
                };
            } else {
                const name = data[1];
                newNode = {
                    id: getId(),
                    type,
                    position,
                    data: {label: `${name}`},
                };
            }

            setElements((es: Elements) => es.concat(newNode));
        }
    };

    return (
        <div className="Scene">
            <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                onLoad={onLoad}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                deleteKeyCode={46}
                snapToGrid
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