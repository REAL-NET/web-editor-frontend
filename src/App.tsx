import React, {useEffect, useRef, useState} from 'react';
import {Edge, MarkerType, Node, ReactFlowInstance, ReactFlowProvider} from 'react-flow-renderer';

import PropertyBar from './PropertyBar'
import Palette from './Palette';
import Scene from './Scene';
import {getModelEdges, getModelNodes} from './requests/modelRequests';
import {getEdge, getNode} from './requests/elementRequests';

import './App.css';
import {addAttribute} from "./requests/attributeRequests";
import {Errors, queryCheckWithErrorInfo} from "./requests/сonstraintsCheckRequests";

document.addEventListener('click', e => (e.target));

const OverviewFlow = () => {
    const modelName = 'QueryModel';
    const metamodelName = 'QueryMetamodel';

    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [captureElementClick,] = useState<boolean>(true);
    const [currentElementId, setCurrentElementId] = useState<string>("");
    const [checkErrorInfo, setCheckErrorInfo] = useState<number[]>([]);
    const nodesRef = useRef<Node[]>([])

    useEffect(() => {
        nodesRef.current = nodes;
    }, [nodes]);

    // model
    useEffect(() => {
        Promise.all([getModelNodes(modelName), getModelEdges(modelName)]).then(async data => {
            let nodesArray: Array<{ id: number, name: string }> = [];
            let edgesArray: Array<{ id: number, name: string }> = [];
            if (data[0] !== undefined) {
                data[0].forEach((element: { id: number, name: string }) => {
                    nodesArray.push(element);
                });
            }
            if (data[1] !== undefined) {
                data[1].forEach((element: { id: number, name: string }) => {
                    edgesArray.push(element);
                });
            }
            const currentNodes = await getNodes(modelName, nodesArray);
            setNodes(currentNodes);
            const currentEdges = await getEdges(modelName, edgesArray);
            setEdges(currentEdges);

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
        });
    }, []);

    const getNodes = async (modelName: string, nodes: Array<{ id: number, name: string }>): Promise<Node[]> => {
        let currentNodes: Node[] = [];
        await Promise.all(nodes.map(async node => {
            const currentNode = await getNode(modelName, node.id);
            if (currentNode !== undefined) {
                const id = +currentNode.id;
                const attributes = currentNode.attributes;
                const xCoordinate = attributes.find(attribute => attribute.name === 'xCoordinate');
                const yCoordinate = attributes.find(attribute => attribute.name === 'yCoordinate');
                const kind = attributes.find(attribute => attribute.name === 'kind')?.stringValue ?? 'unknown';
                const width = attributes.find(attribute => attribute.name === 'width')?.stringValue ?? (kind === 'operator' || kind === 'reader' ? 90 : 350);
                const height = attributes.find(attribute => attribute.name === 'height')?.stringValue ?? (kind === 'operator' || kind === 'reader' ? 40 : 90);
                const name = kind !== 'materializationLine' && kind !== 'operatorInternals' ? currentNode.name : '';
                const dragHandle = kind === 'materializationLine' ? '.materializationLineNodeHandle' : '.nodeHandle';
                const style = kind === 'materializationLine' ? {zIndex: 10} : kind === 'operatorInternals' ? {zIndex: -10} : {zIndex: 0};
                let node: Node = {
                    id: `${id}`,
                    type: `${kind}Node`,
                    className: `${kind}Node`,
                    data: {
                        label: name,
                        width: +width,
                        height: +height,
                        isSelected: false,
                        modelName: modelName,
                        id: id,
                        nodes: nodesRef,
                        setNodes: setNodes
                    },
                    position: {x: 0, y: 0},
                    dragHandle: dragHandle,
                    style: style
                }
                if (xCoordinate === undefined || xCoordinate.stringValue.length === 0 ||
                    yCoordinate === undefined || yCoordinate.stringValue.length === 0) {
                    addAttribute(modelName, id, 'xCoordinate', '0');
                    addAttribute(modelName, id, 'yCoordinate', '0');
                } else {
                    node.position = {x: +xCoordinate.stringValue, y: +yCoordinate.stringValue};
                }
                currentNodes.push(node);
            }
        }));

        return currentNodes;
    }

    const getEdges = async (modelName: string, edges: Array<{ id: number, name: string }>): Promise<Edge[]> => {
        let currentEdges: Edge[] = [];
        await Promise.all(edges.map(async edge => {
            const newEdge = await getEdge(modelName, edge.id);
            if (newEdge !== undefined) {
                const attributes = newEdge.attributes;
                const type = attributes.find(attribute => attribute.name === 'type')?.stringValue;
                if (type === 'internals') {
                    setNodes((nodes: Node[]) =>
                        nodes.map((node) => {
                            if (node.id === `${newEdge.to.id}`) {
                                node.parentNode = `${newEdge.from.id}`;
                                node.extent = 'parent';
                            }
                            return node;
                        })
                    );
                } else {
                    let sourcePort = attributes.find(attribute => attribute.name === 'sourcePort')?.stringValue;
                    sourcePort = sourcePort !== undefined ? sourcePort.charAt(0).toUpperCase() + sourcePort.slice(1) : 'Bottom';
                    let targetPort = attributes.find(attribute => attribute.name === 'targetPort')?.stringValue;
                    targetPort = targetPort !== undefined ? targetPort.charAt(0).toUpperCase() + targetPort.slice(1) : 'Top';
                    const type = attributes.find(attribute => attribute.name === 'type')?.stringValue ?? 'local';
                    currentEdges.push(
                        {
                            id: `${newEdge.id}`,
                            source: `${newEdge.from.id}`,
                            target: `${newEdge.to.id}`,
                            type: `${type}Edge`,
                            data: {
                                modelName: modelName,
                                id: newEdge.id,
                                setEdges: setEdges
                            },
                            sourceHandle: `port${sourcePort}`,
                            targetHandle: `port${targetPort}`
                        }
                    );
                }
            }
        }));

        return currentEdges;
    }

    return (
        <div className="OverviewFlow">
            <ReactFlowProvider>
                <PropertyBar
                    modelName={modelName}
                    id={currentElementId}
                    nodes={nodes}
                    edges={edges}
                    setNodes={setNodes}
                    setEdges={setEdges}
                />
                <Scene
                    modelName={modelName}
                    metamodelName={metamodelName}
                    nodes={nodes}
                    edges={edges}
                    setNodes={setNodes}
                    setEdges={setEdges}
                    reactFlowInstance={reactFlowInstance}
                    setReactFlowInstance={setReactFlowInstance}
                    setCurrentElementId={setCurrentElementId}
                    captureElementClick={captureElementClick}
                    checkErrorInfo={checkErrorInfo}
                    setCheckErrorInfo={setCheckErrorInfo}
                />
                <Palette metamodelName={metamodelName}/>
            </ReactFlowProvider>
        </div>
    );
};

export default OverviewFlow;