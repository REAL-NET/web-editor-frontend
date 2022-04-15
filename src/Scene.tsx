import React, {DragEvent, MouseEvent, useCallback} from 'react';
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Connection,
    ConnectionMode,
    Controls,
    Edge,
    Node,
    ReactFlowInstance,
} from 'react-flow-renderer';

import './Scene.css'

import OperatorNode from './nodes/OperatorNode';
import OperatorInternalsNode from './nodes/OperatorInternalsNode';
import ReaderNode from './nodes/ReaderNode';
import MaterializationPlankNode from './nodes/MaterializationPlankNode';
import ImageNode from './nodes/ImageNode';
import RobotsModelNode from './nodes/RobotsModelNode';
import {setAttributeValue} from './requests/attributeRequests';
import {
    addElement,
    getEdge,
    getNode,
    setEdgeFromElement,
    setEdgeToElement
} from './requests/elementRequests';
import {getModelEdges} from "./requests/modelRequests";

type SceneProps = {
    modelName: string
    metamodelName: string
    nodes: Node[]
    edges: Edge[]
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
    reactFlowInstance: ReactFlowInstance | undefined
    setReactFlowInstance: Function
    setCurrentElementId: Function
    captureElementClick: boolean
}

const nodeTypes = {
    operatorNode: OperatorNode,
    operatorInternalsNode: OperatorInternalsNode,
    readerNode: ReaderNode,
    materializationPlankNode: MaterializationPlankNode,
    robotsNode: RobotsModelNode,
    imageNode: ImageNode,
};

const Scene: React.FC<SceneProps> = ({
                                         modelName, metamodelName, nodes, edges, setNodes, setEdges, reactFlowInstance,
                                         setReactFlowInstance, setCurrentElementId, captureElementClick
                                     }) => {
    const onNodeClick = (_: MouseEvent, node: Node) => {
        setCurrentElementId(node.id);
    };

    const onEdgeClick = (_: MouseEvent, edge: Edge) => {
        setCurrentElementId(edge.id);
    };

    // Any node moving
    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    // TODO: add delete handling with backend
    const onNodesChange = useCallback(
        (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
        []
    );

    // TODO: add delete handling with backend
    const onEdgesChange = useCallback(
        (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
        []
    );

    const onInit = (_reactFlowInstance: ReactFlowInstance) => setReactFlowInstance(_reactFlowInstance);

    const onConnect = (edgeParas: Edge | Connection): void => {
        addEdgeElement(metamodelName, modelName, edgeParas.source !== null ? +edgeParas.source : -1,
            edgeParas.target !== null ? +edgeParas.target : -1).then((id: string) => {
            if (id !== '') {
                getEdge(modelName, +id).then(edge => {
                    const newLink = {
                        id: `${edge.id}`,
                        source: `${edgeParas.source}`,
                        target: `${edgeParas.target}`,
                        label: `${edge.name}`
                    }
                    setEdges((edges: Edge[]) => addEdge(newLink, edges));
                });
            }
        });
    };

    let id = 0;
    const getId = function (): string {
        while (nodes.find(item => item.id === `${id}`) !== undefined) {
            ++id;
        }
        while (edges.find(item => item.id === `${id}`) !== undefined) {
            ++id;
        }
        return `${id}`;
    };

    const onDrop = (event: DragEvent) => {
        event.preventDefault();
        if (reactFlowInstance) {
            const data = event.dataTransfer.getData('application/reactflow').split(' ');
            const kind = data[0];
            const position = reactFlowInstance.project({x: event.clientX - 280, y: event.clientY - 40});

            let newNode: Node;
            if (kind === 'ImageNode') {
                newNode = {
                    id: getId(),
                    type: 'imageNode',
                    position,
                    data: {label: `${kind}`},
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
                setNodes((nodes: Node[]) => nodes.concat(newNode));
            } else {
                const parentsId = data[1];
                addNodeElement(modelName, +parentsId, kind, position.x, position.y).then(node => {
                    setNodes((nodes: Node[]) => nodes.concat(node));
                })
            }
        }
    };

    // Scene node stops being dragged/moved
    const onNodeDragStop = (event: MouseEvent, node: Node) => {
        event.preventDefault();
        setAttributeValue(modelName, +node.id, 'xCoordinate', `${node.position.x}`);
        setAttributeValue(modelName, +node.id, 'yCoordinate', `${node.position.y}`);
    };

    const addNodeElement = async (modelName: string, parentsId: number, kind: string, xCoordinate: number, yCoordinate: number) => {
        let id = '';
        let newNode: Node = {
            data: {},
            id: '',
            position: {x: -1, y: -1}
        }
        await addElement(modelName, parentsId).then((newNodeId: string) => {
            id = newNodeId;
            return Promise.all([getNode(modelName, +newNodeId), setAttributeValue(modelName, +newNodeId, 'xCoordinate', `${xCoordinate}`),
                setAttributeValue(modelName, +newNodeId, 'yCoordinate', `${yCoordinate}`)]);
        }).then(data => {
            const name = kind !== 'materializationPlank' ? data[0].name : '';
            const dragHandle = kind === 'materializationPlank' ? '.materializationPlankNodeHandle' : '.nodeHandle';
            const style = kind === 'materializationPlank' ? {zIndex: 100} : {};
            newNode = {
                id: `${id}`,
                type: `${kind}Node`,
                className: `${kind}Node`,
                position: {x: xCoordinate, y: yCoordinate},
                data: {label: `${name}`},
                dragHandle: dragHandle,
                style: style
            };
        });
        return newNode;
    }

    const addEdgeElement = async (metamodelName: string, modelName: string, fromElementId: number, toElementId: number): Promise<string> => {
        let id = '';
        await getModelEdges(metamodelName).then((edges: Array<{id: number, name: string}>) => {
            for (let i = 0, length = edges.length; i < length; ++i) {
                if (edges[i].name === 'Link') {
                    return getEdge(metamodelName, edges[i].id)
                }
            }
        }).then((edge: {id: number, name: string}) => {
            return addElement(modelName, edge.id);
        }).then((newEdgeId: string) => {
            setEdgeFromElement(modelName, +newEdgeId, fromElementId);
            setEdgeToElement(modelName, +newEdgeId, toElementId);
            id = newEdgeId;
        });
        return id;
    }

    return (
        <div className="Scene">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onInit={onInit}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                deleteKeyCode={'Delete'}
                snapToGrid
                snapGrid={[25, 25]}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeDragStop={onNodeDragStop}
                onNodeClick={captureElementClick ? onNodeClick : undefined}
                onEdgeClick={captureElementClick ? onEdgeClick : undefined}
                connectionMode={ConnectionMode.Loose}
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