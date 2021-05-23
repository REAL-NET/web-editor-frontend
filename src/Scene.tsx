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
import {addAttribute, setAttributeValue} from './requests/attributesRequests';
import {addElement, deleteElement, getNode} from './requests/elementRequests';

type SceneProps = {
    modelName: string
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
                                         modelName, elements, setElements, reactFlowInstance,
                                         setReactFlowInstance, setCurrentElementId, captureElementClick
                                     }) => {
    const onElementClick = (_: MouseEvent, element: FlowElement) => {
        setCurrentElementId(element.id);
    }

    // Any node moving
    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onElementsRemove = (elementsToRemove: Elements): void => {
        setElements((elements: Elements) => removeElements(elementsToRemove, elements));
        elementsToRemove.forEach(element => {
            deleteElement(modelName, +element.id);
        })
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
            const name = data[2];
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
                setElements((es: Elements) => es.concat(newNode));
            } else if (name !== 'Link') {
                const parentsId = data[1];
                addElement(modelName, +parentsId).then((id: string) => {
                    Promise.all([getNode(modelName, +id), addAttribute(modelName, +id, 'xCoordinate', `${position.x}`),
                        addAttribute(modelName, +id, 'yCoordinate', `${position.y}`)]).then(data => {
                        const nodeName = data[0].name;
                        newNode = {
                            id: id,
                            type,
                            position,
                            data: {label: `${nodeName}`},
                        };
                        setElements((es: Elements) => es.concat(newNode));
                    });
                })
            }
        }
    };

    // Scene node stops being dragged/moved
    const onNodeDragStop = (event: MouseEvent, node: Node) => {
        event.preventDefault();
        setAttributeValue(modelName, +node.id, 'xCoordinate', `${node.position.x}`);
        setAttributeValue(modelName, +node.id, 'yCoordinate', `${node.position.y}`);
    }

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
                onNodeDragStop={onNodeDragStop}
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