import React, {DragEvent, MouseEvent, useState} from 'react';
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

import OperatorNode from './nodes/OperatorNode';
import OperatorInternalsNode from './nodes/OperatorInternalsNode';
import ReaderNode from './nodes/ReaderNode';
import MaterializationLineNode from './nodes/MaterializationLineNode';
import ImageNode from './nodes/ImageNode';
import RobotsModelNode from './nodes/RobotsModelNode';
import {getAttributeValue, setAttributeValue} from './requests/attributeRequests';
import {
    addElement, deleteElement,
    getEdge,
    getNode,
    setEdgeFromElement,
    setEdgeToElement
} from './requests/elementRequests';
import {getModelEdges} from "./requests/modelRequests";
import CheckBar from "./CheckBar";
import {Errors, queryCheckWithErrorInfo} from "./requests/сonstraintsCheckRequests";

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

const Scene: React.FC<SceneProps> = ({
                                         modelName, metamodelName, nodes, edges, setNodes, setEdges, reactFlowInstance,
                                         setReactFlowInstance, setCurrentElementId, captureElementClick, checkErrorInfo, setCheckErrorInfo
                                     }) => {

    const [selectedNodeId, setSelectedNodeId] = useState<string>('');

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
                    const deletedNode = nodes.find(node => node.id === change.id);
                    if (deletedNode !== undefined && deletedNode.type === 'operatorInternalsNode') {
                        const children = nodes.filter(node => node.parentNode === `${change.id}`);
                        for (const child of children) {
                            changes.push({type: 'remove', id: child.id});
                            deleteElement(modelName, +child.id);
                        }
                        const edgesModel: Array<{ id: number, name: string }> = await getModelEdges(modelName);
                        const childEdges: number[] = [];
                        for (const edgeModel of edgesModel) {
                            const edge = await getEdge(modelName, +edgeModel.id);
                            if (edge !== undefined) {
                                const source = children.find(child => +child.id === edge.from.id)
                                const target = children.find(child => +child.id === edge.to.id)
                                if (source !== undefined || target !== undefined) {
                                    childEdges.push(edge.id);
                                    deleteElement(modelName, edge.id);
                                } else {
                                    const type = await getAttributeValue(modelName, edge.id, 'type');
                                    if (type === 'internals') {
                                        deleteElement(modelName, edge.id);
                                    }
                                }
                            }
                        }
                        childEdges.forEach(childEdge => {
                            changes.push({type: 'remove', id: `${childEdge}`});
                        })
                    }
                    await deleteElement(modelName, +change.id);
                }
            }));
            check();
        }
        setNodes((ns) => applyNodeChanges(changes, ns));
    });

    const onEdgesChange = (async (changes: EdgeChange[]) => {
        await Promise.all(changes.map(async (change) => {
            if (change.type === 'remove') {
                await deleteElement(modelName, +change.id);
            }
        }));
        check();
        setEdges((es) => applyEdgeChanges(changes, es));
    });

    const onInit = (_reactFlowInstance: ReactFlowInstance) => setReactFlowInstance(_reactFlowInstance);

    const onConnect = async (edgeParas: Edge | Connection) => {
        const newEdgeId = await addEdgeElement(metamodelName, modelName, edgeParas.source !== null ? +edgeParas.source : -1, edgeParas.target !== null ? +edgeParas.target : -1);
        if (newEdgeId !== undefined && newEdgeId !== '') {
            const newEdge = await getEdge(modelName, +newEdgeId);
            const newLink = {
                id: `${newEdge.id}`,
                source: `${edgeParas.source}`,
                target: `${edgeParas.target}`,
                // label: `${newEdge.name}`
            }
            setEdges((edges: Edge[]) => addEdge(newLink, edges));
        }
        check();
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

    const check = async () => {
        const checkResult = await queryCheckWithErrorInfo(modelName);
        if (checkResult !== undefined) {
            if (!checkResult.result) {
                let codes: number[] = [];
                checkResult.errors.forEach((error: Errors) => codes.push(error.code));
                setCheckErrorInfo(codes);
            } else {
                setCheckErrorInfo([]);
            }
        }
    }

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
                setNodes(nodes => nodes.concat(newNode));
                check();
            }
        }
    };

    // Scene node stops being dragged/moved
    const onNodeDragStop = async (event: MouseEvent, node: Node) => {
        event.preventDefault();
        await Promise.all([setAttributeValue(modelName, +node.id, 'xCoordinate', `${node.position.x}`),
            setAttributeValue(modelName, +node.id, 'yCoordinate', `${node.position.y}`)]);
        check();
    };

    const addNodeElement = async (modelName: string, parentsId: number, kind: string, xCoordinate: number, yCoordinate: number) => {
        const newNodeId = await addElement(modelName, parentsId);
        const newNode = await getNode(modelName, +newNodeId);
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
                    if (newEdgeId !== undefined && newEdgeId !== '') {
                        setAttributeValue(modelName, +newEdgeId, 'type', 'internals');
                    }
                }
            }
        }
        const size = await Promise.all([getAttributeValue(modelName, newNodeId, 'width'),
            getAttributeValue(modelName, newNodeId, 'height'),
            setAttributeValue(modelName, +newNodeId, 'xCoordinate', `${xCoordinate}`),
            setAttributeValue(modelName, +newNodeId, 'yCoordinate', `${yCoordinate}`)]);
        const width = size[0] ?? (kind === 'operator' || kind === 'reader' ? 80 : 350);
        const height = size[1] ?? (kind === 'operator' || kind === 'reader' ? 50 : 80);
        const node: Node = {
            id: `${newNodeId}`,
            type: `${kind}Node`,
            className: `${kind}Node`,
            position: {x: xCoordinate, y: yCoordinate},
            data: {label: `${name}`, width: width, height: height, isSelected: false, modelName: modelName, id: newNodeId},
            dragHandle: dragHandle,
            parentNode: parentNode,
            extent: extent,
            style: style
        };
        return node;
    }

    const addEdgeElement = async (metamodelName: string, modelName: string, fromElementId: number, toElementId: number) => {
        const edgesArray: Array<{id: number, name: string}> = await getModelEdges(metamodelName);
        for (let i = 0, length = edgesArray.length; i < length; ++i) {
            if (edgesArray[i].name === 'link') {
                const newEdgeId: string = await addElement(modelName, edgesArray[i].id);
                setEdgeFromElement(modelName, +newEdgeId, fromElementId);
                setEdgeToElement(modelName, +newEdgeId, toElementId);
                return newEdgeId;
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
                deleteKeyCode={'Delete'}
                snapToGrid
                snapGrid={snapGrid}
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
                <CheckBar checkErrorInfo={checkErrorInfo}/>
            </ReactFlow>
        </div>
    );
};

export default Scene;