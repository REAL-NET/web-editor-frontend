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

    const defaultWidthSmallBlock = 90;
    const defaultWidthLargeBlock = 350;
    const defaultHeightSmallBlock = 40;
    const defaultHeightLargeBlock = 90;

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
        let promises: Promise<any>[] = [];
        if (changes.find(change => change.type === 'remove') !== undefined) {
            await Promise.all(changes.map(async (change) => {
                if (change.type === 'remove') {
                    const result = await deepDeleteElement(change, modelName, nodes);
                    changes = result.newChanges;
                    promises = result.promises;
                }
            }));
            setNodes((nodes) => applyNodeChanges(changes, nodes));
            await Promise.all(promises);
            check(modelName, setCheckErrorInfo);
        }
        else {
            setNodes((nodes) => applyNodeChanges(changes, nodes));
        }
    });

    const onEdgesChange = (async (changes: EdgeChange[]) => {
        await Promise.all(changes.map(async (change) => {
            if (change.type === 'remove') {
                await deleteElement(modelName, +change.id);
            }
        }));
        setEdges((es) => applyEdgeChanges(changes, es));
        check(modelName, setCheckErrorInfo);
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
                    setEdges: setEdges,
                    setCheckErrorInfo: setCheckErrorInfo
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
            } else if (kind === 'operator' && data.length > 2) {
                const operatorInternalsNodes = nodes.filter(node => node.type === 'operatorInternalsNode');
                let flag = false;
                for (const node of operatorInternalsNodes) {
                    // check if dropped node is inside operator internals node
                    if (position.y >= node.position.y && (position.y + defaultHeightSmallBlock) <= (node.position.y + node.height!) &&
                        position.x >= node.position.x && (position.x + defaultWidthSmallBlock) <= (node.position.x + node.width!)) {
                        flag = true;
                        const parentId = data[1];
                        const newNode = await addNodeElement(modelName, +parentId, kind, position.x, position.y);
                        if (newNode !== undefined) {
                            setNodes(nodes => nodes.concat(newNode));
                            check(modelName, setCheckErrorInfo);
                        }
                    }
                }
                if (!flag) {
                    const name = data[1];
                    const nodeParentId = data[2];
                    const groupParentId = data[3];
                    const childParentId = data[4];
                    if (name !== 'Join') {
                        const newElements = await addNodeWithGroupAndChild(modelName, +nodeParentId, +groupParentId, +childParentId, kind, position.x, position.y);
                        if (newElements !== undefined) {
                            setNodes(nodes => nodes.concat(newElements.newNodesArray));
                            if (newElements.newEdge !== undefined) {
                                setEdges((edges: Edge[]) => addEdge(newElements.newEdge, edges));
                            }
                            check(modelName, setCheckErrorInfo);
                        }
                    } else {
                        const newElements = await addNodeWithGroupAndTwoChildren(modelName, +nodeParentId, +groupParentId, +childParentId, kind, position.x, position.y);
                        if (newElements !== undefined) {
                            setNodes(nodes => nodes.concat(newElements.newNodesArray));
                            if (newElements.newEdgesArray !== undefined) {
                                for (const newEdge of newElements.newEdgesArray) {
                                    setEdges((edges: Edge[]) => addEdge(newEdge, edges));
                                }
                            }
                            check(modelName, setCheckErrorInfo);
                        }
                    }
                }
            } else {
                const parentId = data[1];
                const newNode = await addNodeElement(modelName, +parentId, kind, position.x, position.y);
                if (newNode !== undefined) {
                    setNodes(nodes => nodes.concat(newNode));
                    check(modelName, setCheckErrorInfo);
                }
            }
        }
    };

    const addNodeElement = async (modelName: string, parentId: number, kind: string, xCoordinate: number, yCoordinate: number) => {
        const newNodeId = await addElement(modelName, parentId);
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
                        if (yCoordinate >= node.position.y && (yCoordinate + defaultHeightSmallBlock) <= (node.position.y + node.height!) &&
                            xCoordinate >= node.position.x && (xCoordinate + defaultWidthSmallBlock) <= (node.position.x + node.width!)) {
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
                    getAttributeValue(modelName, newNodeId, 'height')]);
                await Promise.all([setAttributeValue(modelName, newNodeId, 'xCoordinate', `${xCoordinate}`),
                    setAttributeValue(modelName, newNodeId, 'yCoordinate', `${yCoordinate}`)]);
                const width = size[0] ?? (kind === 'operator' || kind === 'reader' ? defaultWidthSmallBlock : defaultWidthLargeBlock);
                const height = size[1] ?? (kind === 'operator' || kind === 'reader' ? defaultHeightSmallBlock : defaultHeightLargeBlock);
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
                        setNodes: setNodes,
                        setCheckErrorInfo: setCheckErrorInfo
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

    const addNodeWithGroupAndChild = async (modelName: string, nodeParentId: number, groupParentId: number, childParentId: number,
                                            nodeKind: string, nodeXCoordinate: number, nodeYCoordinate: number) => {
        const defaultNodeKind = 'operator';
        const defaultGroupKind = 'operatorInternals';
        const defaultChildKind = 'reader';

        const newNodesId = await Promise.all([addElement(modelName, nodeParentId), addElement(modelName, groupParentId),
            addElement(modelName, childParentId)]);
        const newNodeId = newNodesId[0];
        const newGroupId = newNodesId[1];
        const newChildId = newNodesId[2];
        if (newNodeId !== undefined && newGroupId !== undefined && newChildId !== undefined) {
            const newNodes = await Promise.all([getNode(modelName, newNodeId), getNode(modelName, newGroupId), getNode(modelName, newChildId)]);
            if (newNodes.every(newNode => newNode !== undefined)) {
                let newNodesArray: Node[] = [];
                for (const newNode of newNodes) {
                    if (newNode !== undefined) {
                        const newNodeKind = newNode.attributes.find(attribute => attribute.name === 'kind')?.stringValue;
                        const name = newNodeKind !== defaultGroupKind ? newNode.name : '';
                        const dragHandle = '.nodeHandle';
                        const style = newNodeKind === defaultGroupKind ? {zIndex: -10} : {zIndex: 0};
                        let parentNode = undefined;
                        let extent: 'parent' | undefined = undefined;
                        const size = await Promise.all([getAttributeValue(modelName, newNode.id, 'width'),
                            getAttributeValue(modelName, newNode.id, 'height')]);
                        const width = size[0] ?? (newNodeKind === defaultNodeKind || newNodeKind === defaultChildKind ?
                            defaultWidthSmallBlock : defaultWidthLargeBlock);
                        const height = size[1] ?? (newNodeKind === defaultNodeKind || newNodeKind === defaultChildKind ?
                            defaultHeightSmallBlock : defaultHeightLargeBlock);
                        let currentXCoordinate = nodeXCoordinate;
                        let currentYCoordinate = nodeYCoordinate;
                        if (newNodeKind !== defaultGroupKind) {
                            parentNode = `${newGroupId}`;
                            extent = 'parent';
                            // position relative
                            if (newNodeKind === defaultChildKind)
                            {
                                currentXCoordinate = (defaultWidthLargeBlock - 2 * defaultWidthSmallBlock) / 3;
                                currentYCoordinate = (defaultHeightLargeBlock - defaultHeightSmallBlock) / 2;
                            } else if (newNodeKind === defaultNodeKind) {
                                currentXCoordinate = defaultWidthLargeBlock - (defaultWidthLargeBlock - 2 * defaultWidthSmallBlock) / 3
                                    - defaultWidthSmallBlock;
                                currentYCoordinate = (defaultHeightLargeBlock - defaultHeightSmallBlock) / 2;
                            }
                            const newEdgeId = await addEdgeElement(metamodelName, modelName, newGroupId, newNode.id);
                            if (newEdgeId !== undefined) {
                                setAttributeValue(modelName, +newEdgeId, 'type', 'internals');
                            }
                        }
                        await Promise.all([setAttributeValue(modelName, newNode.id, 'xCoordinate', `${currentXCoordinate}`),
                            setAttributeValue(modelName, newNode.id, 'yCoordinate', `${currentYCoordinate}`)]);
                        const node: Node = {
                            id: `${newNode.id}`,
                            type: `${newNodeKind}Node`,
                            className: `${newNodeKind}Node`,
                            position: {x: currentXCoordinate, y: currentYCoordinate},
                            data: {
                                label: `${name}`,
                                width: +width,
                                height: +height,
                                isSelected: false,
                                modelName: modelName,
                                id: newNode.id,
                                nodes: nodesRef,
                                setNodes: setNodes,
                                setCheckErrorInfo: setCheckErrorInfo
                            },
                            dragHandle: dragHandle,
                            parentNode: parentNode,
                            extent: extent,
                            style: style
                        };
                        if (newNodeKind === 'operatorInternals') {
                            newNodesArray = [node].concat(newNodesArray);
                        } else {
                            newNodesArray.push(node);
                        }
                    }
                }

                const newEdgeId = await addEdgeElement(metamodelName, modelName, newNodeId, newChildId);
                const defaultSourcePort = 'Left';
                const defaultTargetPort = 'Right';
                if (newEdgeId !== undefined) {
                    const newEdge = {
                        id: `${newEdgeId}`,
                        source: `${newNodeId}`,
                        target: `${newChildId}`,
                        type: 'localEdge',
                        data: {
                            modelName: modelName,
                            id: newEdgeId,
                            setEdges: setEdges,
                            setCheckErrorInfo: setCheckErrorInfo
                        },
                        sourceHandle: `port${defaultSourcePort}`,
                        targetHandle: `port${defaultTargetPort}`,
                    }
                    setAttributeValue(modelName, newEdgeId, 'sourcePort', defaultSourcePort);
                    setAttributeValue(modelName, newEdgeId, 'targetPort', defaultTargetPort);

                    return {newNodesArray, newEdge};
                }

                return {newNodesArray, undefined};
            }
        }

        return undefined;
    }

    const addNodeWithGroupAndTwoChildren = async (modelName: string, nodeParentId: number, groupParentId: number, childParentId: number,
                                            nodeKind: string, nodeXCoordinate: number, nodeYCoordinate: number) => {
        const defaultNodeKind = 'operator';
        const defaultGroupKind = 'operatorInternals';
        const defaultChildKind = 'reader';

        const newNodesId = await Promise.all([addElement(modelName, nodeParentId), addElement(modelName, groupParentId),
            addElement(modelName, childParentId), addElement(modelName, childParentId)]);
        const newNodeId = newNodesId[0];
        const newGroupId = newNodesId[1];
        const newChild1Id = newNodesId[2];
        const newChild2Id = newNodesId[3];
        if (newNodeId !== undefined && newGroupId !== undefined && newChild1Id !== undefined && newChild2Id !== undefined) {
            const newNodes = await Promise.all([getNode(modelName, newNodeId), getNode(modelName, newGroupId),
                getNode(modelName, newChild1Id), getNode(modelName, newChild2Id)]);
            if (newNodes.every(newNode => newNode !== undefined)) {
                let newNodesArray: Node[] = [];
                let childrenCount = 0;
                for (const newNode of newNodes) {
                    if (newNode !== undefined) {
                        const newNodeKind = newNode.attributes.find(attribute => attribute.name === 'kind')?.stringValue;
                        const name = newNodeKind !== defaultGroupKind ? newNode.name : '';
                        const dragHandle = '.nodeHandle';
                        const style = newNodeKind === defaultGroupKind ? {zIndex: -10} : {zIndex: 0};
                        let parentNode = undefined;
                        let extent: 'parent' | undefined = undefined;
                        const size = await Promise.all([getAttributeValue(modelName, newNode.id, 'width'),
                            getAttributeValue(modelName, newNode.id, 'height')]);
                        const width = size[0] ?? (newNodeKind === defaultNodeKind || newNodeKind === defaultChildKind ?
                            defaultWidthSmallBlock : defaultWidthLargeBlock);
                        const height = size[1] ?? (newNodeKind === defaultNodeKind || newNodeKind === defaultChildKind ?
                            defaultHeightSmallBlock : defaultHeightLargeBlock);
                        let currentXCoordinate = nodeXCoordinate;
                        let currentYCoordinate = nodeYCoordinate;
                        if (newNodeKind !== defaultGroupKind) {
                            parentNode = `${newGroupId}`;
                            extent = 'parent';
                            // position relative
                            if (newNodeKind === defaultChildKind)
                            {
                                if (childrenCount === 0) {
                                    currentXCoordinate = (defaultWidthLargeBlock - 3 * defaultWidthSmallBlock) / 4;
                                } else {
                                    currentXCoordinate = defaultWidthLargeBlock - (defaultWidthLargeBlock - 3 * defaultWidthSmallBlock) / 4
                                        - defaultWidthSmallBlock;
                                }
                                currentYCoordinate = (defaultHeightLargeBlock - defaultHeightSmallBlock) / 2;
                                childrenCount += 1;
                            } else if (newNodeKind === defaultNodeKind) {
                                currentXCoordinate = 2 * (defaultWidthLargeBlock - 3 * defaultWidthSmallBlock) / 4 + defaultWidthSmallBlock;
                                currentYCoordinate = (defaultHeightLargeBlock - defaultHeightSmallBlock) / 2;
                            }
                            const newEdgeId = await addEdgeElement(metamodelName, modelName, newGroupId, newNode.id);
                            if (newEdgeId !== undefined) {
                                setAttributeValue(modelName, +newEdgeId, 'type', 'internals');
                            }
                        }
                        await Promise.all([setAttributeValue(modelName, newNode.id, 'xCoordinate', `${currentXCoordinate}`),
                            setAttributeValue(modelName, newNode.id, 'yCoordinate', `${currentYCoordinate}`)]);
                        const node: Node = {
                            id: `${newNode.id}`,
                            type: `${newNodeKind}Node`,
                            className: `${newNodeKind}Node`,
                            position: {x: currentXCoordinate, y: currentYCoordinate},
                            data: {
                                label: `${name}`,
                                width: +width,
                                height: +height,
                                isSelected: false,
                                modelName: modelName,
                                id: newNode.id,
                                nodes: nodesRef,
                                setNodes: setNodes,
                                setCheckErrorInfo: setCheckErrorInfo
                            },
                            dragHandle: dragHandle,
                            parentNode: parentNode,
                            extent: extent,
                            style: style
                        };
                        if (newNodeKind === 'operatorInternals') {
                            newNodesArray = [node].concat(newNodesArray);
                        } else {
                            newNodesArray.push(node);
                        }
                    }
                }

                const newEdgesId = await Promise.all([addEdgeElement(metamodelName, modelName, newNodeId, newChild1Id),
                    addEdgeElement(metamodelName, modelName, newNodeId, newChild2Id)]);
                if (newEdgesId.every(newEdgeId => newEdgeId !== undefined)) {
                    let newEdgesArray: Edge[] = [];
                    let childrenCount = 0;
                    for (const newEdgeId of newEdgesId) {
                        if (newEdgeId !== undefined) {
                            let sourcePort = 'Left';
                            let targetPort = 'Right';
                            let newChildId = newChild1Id;
                            if (childrenCount !== 0) {
                                sourcePort = 'Right';
                                targetPort = 'Left';
                                newChildId = newChild2Id;
                            }
                            const edge = {
                                id: `${newEdgeId}`,
                                source: `${newNodeId}`,
                                target: `${newChildId}`,
                                type: 'localEdge',
                                data: {
                                    modelName: modelName,
                                    id: newEdgeId,
                                    setEdges: setEdges,
                                    setCheckErrorInfo: setCheckErrorInfo
                                },
                                sourceHandle: `port${sourcePort}`,
                                targetHandle: `port${targetPort}`,
                            }
                            setAttributeValue(modelName, newEdgeId, 'sourcePort', sourcePort);
                            setAttributeValue(modelName, newEdgeId, 'targetPort', targetPort);
                            newEdgesArray.push(edge);
                            childrenCount += 1;
                        }
                    }

                    return {newNodesArray, newEdgesArray};
                }

                return {newNodesArray, undefined};
            }
        }

        return undefined;
    }

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