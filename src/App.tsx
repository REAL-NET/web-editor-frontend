import React, {useState, useEffect} from 'react';
import {Edge, Node, ReactFlowInstance, ReactFlowProvider} from 'react-flow-renderer';

import PropertyBar from './PropertyBar'
import Palette from './Palette';
import Scene from './Scene';
import {getModelNodes, getModelEdges} from './requests/modelRequests';
import {getEdge, getNode} from './requests/elementRequests';

import './App.css';
import {addAttribute, getAttributeValue} from "./requests/attributeRequests";
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
            const data = await getNode(modelName, node.id);
            if (data !== undefined) {
                const id = +data.id;
                const attributeValues = await Promise.all([getAttributeValue(modelName, id, 'xCoordinate'),
                    getAttributeValue(modelName, id, 'yCoordinate'), getAttributeValue(modelName, id, 'kind'),
                    getAttributeValue(modelName, id, 'width'), getAttributeValue(modelName, id, 'height')]);
                const kind = attributeValues[2] ?? 'unknown'
                const width = attributeValues[3] ?? (kind === 'operator' || kind === 'reader' ? 80 : 350);
                const height = attributeValues[4] ?? (kind === 'operator' || kind === 'reader' ? 50 : 80);
                const name = kind !== 'materializationLine' && kind !== 'operatorInternals' ? data.name : '';
                const dragHandle = kind === 'materializationLine' ? '.materializationLineNodeHandle' : '.nodeHandle';
                const style = kind === 'materializationLine' ? {zIndex: 10} : kind === 'operatorInternals' ? {zIndex: -10} : {zIndex: 0};
                let node: Node = {
                    id: `${id}`,
                    type: `${kind}Node`,
                    className: `${kind}Node`,
                    data: {label: name, width: width, height: height, isSelected: false},
                    position: {x: 0, y: 0},
                    dragHandle: dragHandle,
                    style: style
                }
                if (attributeValues[0] === undefined || attributeValues[0].length === 0 || attributeValues[1] === undefined || attributeValues[1].length === 0) {
                    addAttribute(modelName, id, 'xCoordinate', '0');
                    addAttribute(modelName, id, 'yCoordinate', '0');
                } else {
                    node.position = {x: attributeValues[0], y: attributeValues[1]};
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
            if (edge !== undefined) {
                const type = await getAttributeValue(modelName, newEdge.id, 'type');
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
                    currentEdges.push(
                        {
                            id: `${newEdge.id}`,
                            source: `${newEdge.from.id}`,
                            target: `${newEdge.to.id}`,
                            // label: `${edge.name}`,
                            type: 'straight'
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