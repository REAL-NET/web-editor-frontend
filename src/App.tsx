import React, {useState, useEffect} from 'react';
import {Edge, Node, ReactFlowInstance, ReactFlowProvider} from 'react-flow-renderer';

import PropertyBar from './PropertyBar'
import Palette from './Palette';
import Scene from './Scene';
import {getModelNodes, getModelEdges} from './requests/modelRequests';
import {getEdge, getNode} from './requests/elementRequests';

import './App.css';
import {addAttribute, getAttributeValue} from "./requests/attributeRequests";

document.addEventListener('click', e => (e.target));

const OverviewFlow = () => {
    const modelName = 'QueryModel';
    const metamodelName = 'QueryMetamodel';

    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [captureElementClick,] = useState<boolean>(true);
    const [currentElementId, setCurrentElementId] = useState<string>("");

    // model
    useEffect(() => {
        Promise.all([getModelNodes(modelName), getModelEdges(modelName)]).then(async data => {
            let nodes: Array<{ id: number, name: string }> = [];
            let edges: Array<{ id: number, name: string }> = [];
            if (data[0] !== undefined) {
                data[0].forEach((element: { id: number, name: string }) => {
                    nodes.push(element);
                });
            }
            if (data[1] !== undefined) {
                data[1].forEach((element: { id: number, name: string }) => {
                    edges.push(element);
                });
            }
            const currentNodes = await getNodes(modelName, nodes);
            setNodes(currentNodes);
            const currentEdges = await getEdges(modelName, edges);
            setEdges(currentEdges);
        });
    }, []);

    const getNodes = async (modelName: string, nodes: Array<{ id: number, name: string }> ): Promise<Node[]> => {
        let currentNodes: Node[] = [];
        for (let i = 0, length = nodes.length; i < length; ++i) {
            const data = await getNode(modelName, nodes[i].id);
            if (data !== undefined) {
                const id: number = +JSON.stringify(data.id);
                const attributeValues = await Promise.all([getAttributeValue(modelName, id, 'xCoordinate'), getAttributeValue(modelName, id, 'yCoordinate'), getAttributeValue(modelName, id, 'kind')]);
                const kind = attributeValues[2] ?? 'unknown';
                const name = kind !== 'materializationPlank' && kind !== 'operatorInternals' ? data.name : '';
                const dragHandle = kind === 'materializationPlank' ? '.materializationPlankNodeHandle' : '.nodeHandle';
                const style = kind === 'materializationPlank' ? {zIndex: 10} : kind === 'operatorInternals' ? {zIndex: -10} : {zIndex: 0};
                if (attributeValues[0] === undefined || attributeValues[0].length === 0 || attributeValues[1] === undefined || attributeValues[1].length === 0) {
                    addAttribute(modelName, id, 'xCoordinate', '0');
                    addAttribute(modelName, id, 'yCoordinate', '0');
                    currentNodes.push(
                        {
                            id: `${data.id}`,
                            type: `${kind}Node`,
                            className: `${kind}Node`,
                            data: {label: name},
                            position: {x: 0, y: 0},
                            dragHandle: dragHandle,
                            style: style
                        }
                    );
                } else {
                    currentNodes.push(
                        {
                            id: `${data.id}`,
                            type: `${kind}Node`,
                            className: `${kind}Node`,
                            data: {label: name},
                            position: {x: attributeValues[0], y: attributeValues[1]},
                            dragHandle: dragHandle,
                            style: style
                        }
                    );
                }
            }
        }

        return currentNodes;
    }

    const getEdges = async (modelName: string, edges: Array<{ id: number, name: string }>): Promise<Edge[]> => {
        let currentEdges: Edge[] = [];
        for (let i = 0, length = edges.length; i < length; ++i) {
            await getEdge(modelName, edges[i].id).then(data => {
                if (data !== undefined) {
                    currentEdges.push(
                        {
                            id: `${data.id}`,
                            source: `${data.from.id}`,
                            target: `${data.to.id}`,
                            label: `${data.name}`
                        }
                    );
                }
            })
        }
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
                />
                <Palette metamodelName={metamodelName}/>
            </ReactFlowProvider>
        </div>
    );
};

export default OverviewFlow;