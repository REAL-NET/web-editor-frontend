import React, {DragEvent, MouseEvent, useEffect, useRef, useState} from 'react';
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
    EdgeChange,
    NodeChange,
    ReactFlowInstance,
} from 'react-flow-renderer';

import './Scene.css'

import OperatorNode from './elements/nodes/OperatorNode';
import OperatorInternalsNode from './elements/nodes/OperatorInternalsNode';
import ReaderNode from './elements/nodes/ReaderNode';
import MaterializationLineNode from './elements/nodes/MaterializationLineNode';
import ImageNode from './elements/nodes/ImageNode';
import RobotsModelNode from './elements/nodes/RobotsModelNode';
import {getAttributeValue, setAttributeValue} from './requests/attributeRequests';
import {addElement, deleteElement, getNode, setEdgeFromElement, setEdgeToElement} from './requests/elementRequests';
import {getModelEdges} from "./requests/modelRequests";
import CheckBar from "./CheckBar";
import LocalEdge from "./elements/edges/LocalEdge";
import RemoteEdge from "./elements/edges/RemoteEdge";
import {check, deepDeleteElement} from "./utils";

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
    checkErrorInfo: number[]
    setCheckErrorInfo: React.Dispatch<React.SetStateAction<number[]>>
}

const nodeTypes = {
    operatorNode: OperatorNode,
    operatorInternalsNode: OperatorInternalsNode,
    readerNode: ReaderNode,
    materializationLineNode: MaterializationLineNode,
    robotsNode: RobotsModelNode,
    imageNode: ImageNode,
};

const edgeTypes = {
    localEdge: LocalEdge,
    remoteEdge: RemoteEdge,
}

const Scene: React.FC<SceneProps> = ({
                                         modelName,
                                         metamodelName,
                                         nodes,
                                         edges,
                                         setNodes,
                                         setEdges,
                                         reactFlowInstance,
                                         setReactFlowInstance,
                                         setCurrentElementId,
                                         captureElementClick,
                                         checkErrorInfo,
                                         setCheckErrorInfo
                                     }) => {

    const [selectedNodeId, setSelectedNodeId] = useState<string>('');
    const nodesRef = useRef<Node[]>([])

    useEffect(() => {
        nodesRef.current = nodes;
    }, [nodes]);

    const onNodeClick = (_: MouseEvent, node: Node) => {
        setCurrentElementId(node.id);
        if (node.id !== selectedNodeId) {
            const previousNode = nodes.find(nd => nd.id === selectedNodeId);
            if (previousNode !== undefined) {
                previousNode.data.isSelected = false;
            }
            const currentNode = nodes.find(nd => nd.id === node.id);
            if (currentNode !== undefined) {
                currentNode.data.isSelected = true;
            }
            setSelectedNodeId(node.id);
        }
    };

    const onEdgeClick = (_: MouseEvent, edge: Edge) => {
        setCurrentElementId(edge.id);
        if (selectedNodeId !== '') {
            const previousNode = nodes.find(nd => nd.id === selectedNodeId);
            if (previousNode !== undefined) {
                previousNode.data.isSelected = false;
            }
            setSelectedNodeId('');
        }
    };

    // Any node moving
    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onNodesChange = (async (changes: NodeChange[]) => {
        if (changes.find(change => change.type === 'remove') !== undefined) {
            await Promise.all(changes.map(async (change) => {
                if (change.type === 'remove') {
                    const newChanges = await deepDeleteElement(change, modelName, nodes);
                    changes = changes.concat(newChanges);
                    // const deletedNode = nodes.find(node => node.id === change.id);
                    // if (deletedNode !== undefined && deletedNode.type === 'operatorInternalsNode') {
                    //     const children = nodes.filter(node => node.parentNode === change.id);
                    //     if (children.length > 0) {
                    //         for (const child of children) {
                    //             changes.push({type: 'remove', id: child.id});
                    //             deleteElement(modelName, +child.id);
                    //         }
                    //         const edgesModel: Array<{ id: number, name: string }> = await getModelEdges(modelName);
                    //         const childEdges: number[] = [];
                    //         await Promise.all(edgesModel.map(async (edgeModel) => {
                    //             const edge = await getEdge(modelName, +edgeModel.id);
                    //             if (edge !== undefined) {
                    //                 const source = children.find(child => +child.id === edge.from.id)
                    //                 const target = children.find(child => +child.id === edge.to.id)
                    //                 if (source !== undefined || target !== undefined) {
                    //                     childEdges.push(edge.id);
                    //                     deleteElement(modelName, edge.id);
                    //                 } else {
                    //                     const type = edge.attributes.find(attribute => attribute.name === 'type')?.stringValue ?? undefined;
                    //                     if (type === 'internals') {
                    //                         deleteElement(modelName, edge.id);
                    //                     }
                    //                 }
                    //             }
                    //         }));
                    //         childEdges.forEach(childEdge => {
                    //             changes.push({type: 'remove', id: `${childEdge}`});
                    //         })
                    //     }
                    // }
                    // deleteElement(modelName, +change.id);
                }
            }));
            check(modelName, setCheckErrorInfo);
        }
        setNodes((nodes) => applyNodeChanges(changes, nodes));
    });

    const onEdgesChange = (async (changes: EdgeChange[]) => {
        await Promise.all(changes.map(async (change) => {
            if (change.type === 'remove') {
                await deleteElement(modelName, +change.id);
            }
        }));
        check(modelName, setCheckErrorInfo);
        setEdges((es) => applyEdgeChanges(changes, es));
    });

    const onInit = (_reactFlowInstance: ReactFlowInstance) => setReactFlowInstance(_reactFlowInstance);

    const onConnect = async (edgeParas: Edge | Connection) => {
        const newEdgeId = await addEdgeElement(metamodelName, modelName, edgeParas.source !== null ? +edgeParas.source : -1, edgeParas.target !== null ? +edgeParas.target : -1);
        if (newEdgeId !== undefined) {
            const newLink = {
                id: `${newEdgeId}`,
                source: `${edgeParas.source}`,
                target: `${edgeParas.target}`,
                type: 'localEdge',
                data: {
                    modelName: modelName,
                    id: newEdgeId,
                    setEdges: setEdges
                },
                sourceHandle: edgeParas.sourceHandle,
                targetHandle: edgeParas.targetHandle,
            }
            if (edgeParas.sourceHandle !== undefined && edgeParas.sourceHandle !== null) {
                setAttributeValue(modelName, newEdgeId, 'sourcePort', edgeParas.sourceHandle.toLowerCase().slice(4))
            }
            if (edgeParas.targetHandle !== undefined && edgeParas.targetHandle !== null) {
                setAttributeValue(modelName, newEdgeId, 'targetPort', edgeParas.targetHandle.toLowerCase().slice(4))
            }
            setEdges((edges: Edge[]) => addEdge(newLink, edges));
        }
        check(modelName, setCheckErrorInfo);
    }

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

    const onDrop = async (event: DragEvent) => {
        event.preventDefault();
        if (reactFlowInstance) {
            const data = event.dataTransfer.getData('application/reactflow').split(' ');
            const kind = data[0];
            const position = reactFlowInstance.project({x: event.clientX - 280, y: event.clientY - 40});
            if (kind === 'ImageNode') {
                const newNode: Node = {
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
                const newNode = await addNodeElement(modelName, +parentsId, kind, position.x, position.y);
                if (newNode !== undefined) {
                    setNodes(nodes => nodes.concat(newNode));
                    check(modelName, setCheckErrorInfo);
                }
            }
        }
    };

    // Scene node stops being dragged/moved
    const onNodeDragStop = async (event: MouseEvent, node: Node) => {
        event.preventDefault();
        let xCoordinate = node.position.x;
        let yCoordinate = node.position.y;
        if (node.type !== 'materializationLineNode' && node.type !== 'operatorInternalsNode' && node.parentNode === undefined) {
            const operatorInternalsNodes = nodes.filter(node => node.type === 'operatorInternalsNode');
            for (const operatorInternalsNode of operatorInternalsNodes) {
                // check if dropped node is inside operator internals node
                if (yCoordinate >= operatorInternalsNode.position.y && (yCoordinate + node.data.height) <=
                    (operatorInternalsNode.position.y + operatorInternalsNode.height!) &&
                    xCoordinate >= operatorInternalsNode.position.x && (xCoordinate + node.data.width) <=
                    (operatorInternalsNode.position.x + operatorInternalsNode.width!)) {
                    node.parentNode = `${operatorInternalsNode.id}`;
                    node.extent = 'parent';
                    // position relative
                    xCoordinate = xCoordinate - operatorInternalsNode.position.x;
                    yCoordinate = yCoordinate - operatorInternalsNode.position.y;
                    node.position = {x: xCoordinate, y: yCoordinate};
                    const nodeCopy = Object.assign(Object.create(node), node);
                    const changes: NodeChange[] = [{id: node.id, type: 'remove'}];
                    setNodes((nodes) => applyNodeChanges(changes, nodes).concat(nodeCopy));
                    const newEdgeId = await addEdgeElement(metamodelName, modelName, +operatorInternalsNode.id, +node.id);
                    if (newEdgeId !== undefined) {
                        setAttributeValue(modelName, +newEdgeId, 'type', 'internals');
                    }
                }
            }
        }
        await Promise.all([setAttributeValue(modelName, +node.id, 'xCoordinate', `${xCoordinate}`),
            setAttributeValue(modelName, +node.id, 'yCoordinate', `${yCoordinate}`)]);
        check(modelName, setCheckErrorInfo);
    };

    const addNodeElement = async (modelName: string, parentsId: number, kind: string, xCoordinate: number, yCoordinate: number) => {
        const newNodeId = await addElement(modelName, parentsId);
        if (newNodeId !== undefined) {
            const newNode = await getNode(modelName, newNodeId);
            if (newNode !== undefined) {
                const name = kind !== 'materializationLine' && kind !== 'operatorInternals' ? newNode.name : '';
                const dragHandle = kind === 'materializationLine' ? '.materializationLineNodeHandle' : '.nodeHandle';
                const style = kind === 'materializationLine' ? {zIndex: 10} : kind === 'operatorInternals' ? {zIndex: -10} : {zIndex: 0};
                let parentNode = undefined;
                let extent: 'parent' | undefined = undefined;
                if (kind !== 'materializationLine' && kind !== 'operatorInternals') {
                    const operatorInternalsNodes = nodes.filter(node => node.type === 'operatorInternalsNode');
                    for (const node of operatorInternalsNodes) {
                        // check if dropped node is inside operator internals node
                        if (yCoordinate >= node.position.y && (yCoordinate + 30) <= (node.position.y + node.height!) &&
                            xCoordinate >= node.position.x && (xCoordinate + 80) <= (node.position.x + node.width!)) {
                            parentNode = `${node.id}`;
                            extent = 'parent';
                            // position relative
                            xCoordinate = xCoordinate - node.position.x;
                            yCoordinate = yCoordinate - node.position.y;

                            const newEdgeId = await addEdgeElement(metamodelName, modelName, +node.id, newNodeId);
                            if (newEdgeId !== undefined) {
                                setAttributeValue(modelName, +newEdgeId, 'type', 'internals');
                            }
                        }
                    }
                }
                const size = await Promise.all([getAttributeValue(modelName, newNodeId, 'width'),
                    getAttributeValue(modelName, newNodeId, 'height'),
                    setAttributeValue(modelName, +newNodeId, 'xCoordinate', `${xCoordinate}`),
                    setAttributeValue(modelName, +newNodeId, 'yCoordinate', `${yCoordinate}`)]);
                const width = size[0] ?? (kind === 'operator' || kind === 'reader' ? 90 : 350);
                const height = size[1] ?? (kind === 'operator' || kind === 'reader' ? 40 : 90);
                const node: Node = {
                    id: `${newNodeId}`,
                    type: `${kind}Node`,
                    className: `${kind}Node`,
                    position: {x: xCoordinate, y: yCoordinate},
                    data: {
                        label: `${name}`,
                        width: +width,
                        height: +height,
                        isSelected: false,
                        modelName: modelName,
                        id: newNodeId,
                        nodes: nodesRef,
                        setNodes: setNodes
                    },
                    dragHandle: dragHandle,
                    parentNode: parentNode,
                    extent: extent,
                    style: style
                };
                return node;
            }
        }
        return undefined;
    }

    const addEdgeElement = async (metamodelName: string, modelName: string, fromElementId: number, toElementId: number) => {
        const edgesArray: Array<{ id: number, name: string }> = await getModelEdges(metamodelName);
        for (let i = 0, length = edgesArray.length; i < length; ++i) {
            if (edgesArray[i].name === 'link') {
                const newEdgeId = await addElement(modelName, edgesArray[i].id);
                if (newEdgeId !== undefined) {
                    setEdgeFromElement(modelName, newEdgeId, fromElementId);
                    setEdgeToElement(modelName, newEdgeId, toElementId);
                    return newEdgeId;
                }
            }
        }
    }

    const snapGrid: [number, number] = [5, 5];

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
                edgeTypes={edgeTypes}
                deleteKeyCode={'Delete'}
                snapToGrid
                snapGrid={snapGrid}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeDragStop={onNodeDragStop}
                onNodeClick={captureElementClick ? onNodeClick : undefined}
                onEdgeClick={captureElementClick ? onEdgeClick : undefined}
                connectionMode={ConnectionMode.Loose}
                selectionKeyCode={'Shift'}
            >
                <Controls/>
                <Background>
                    gap={25}
                    size={1}
                </Background>
                <CheckBar checkErrorInfo={checkErrorInfo}/>
            </ReactFlow>
        </div>
    );
};

export default Scene;