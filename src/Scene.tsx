import React, {DragEvent, MouseEvent} from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Connection,
    ConnectionMode,
    Controls,
    Edge,
    Elements,
    FlowElement,
    Node,
    OnLoadParams,
    removeElements, updateEdge
} from 'react-flow-renderer';

import './Scene.css'

import ImageNode from './nodes/nodesWithImages/ImageNode';
import RobotsModelNode from './nodes/RobotsModelNode';
import RobotsQRealNode from './nodes/RobotsQRealNode';
import {deleteElement} from './requests/elementRequests';
import {
    AssociationMetatype,
    GeneralizationEdgeStyle,
    GeneralizationEdgeType,
    GeneralizationMetatype
} from "./Constants";
import {
    AddSimpleAttribute,
    AddSimpleSlot,
    CreateAssociations,
    CreateGeneralization,
    DeleteElement,
    GetElement,
    InstantiateAssociation,
    InstantiateNode,
    SetSimpleSlotValue,
} from "./requests/deepElementRequests";
import {AllModels} from "./requests/deepModelRequests";

type SceneProps = {
    modelName: string,
    elements: Elements,
    setElements: React.Dispatch<React.SetStateAction<Elements>>,
    reactFlowInstance: OnLoadParams | undefined,
    setReactFlowInstance: Function,
    setCurrentElementId: Function,
    captureElementClick: boolean,
    edgeType: string
}

const nodeTypes = {
    robotsNode: RobotsModelNode,
    imageNode: ImageNode,
    robotsQRealNode: RobotsQRealNode,
};

const Scene: React.FC<SceneProps> = ({
                                         elements,
                                         setElements,
                                         reactFlowInstance,
                                         setReactFlowInstance,
                                         setCurrentElementId,
                                         captureElementClick,
                                         modelName,
                                         edgeType
                                     }) => {
    const onElementClick = async (_: MouseEvent, element: FlowElement) => {
        setCurrentElementId(element.id);
        const repoElement = await GetElement(modelName, element.id);
        if (repoElement === undefined) {
            console.error("No element retrieved from repo");
            return;
        }
    };

    // Any node moving
    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onElementsRemove = (elementsToRemove: Elements): void => {
        elementsToRemove.forEach(async value => {
            await DeleteElement(modelName, value.id);
        });
        setElements((elements: Elements) => removeElements(elementsToRemove, elements));
    };

    const onLoad = async (_reactFlowInstance: OnLoadParams) => {
        await AllModels();
        setReactFlowInstance(_reactFlowInstance);
    };

    const onConnect = async (edgeParas: Edge | Connection) => {
        const edge = edgeParas as Edge;
        let name: string, metaType: string = "", metaModel: string = "";
        if (edgeType === AssociationMetatype || edgeType === GeneralizationMetatype) {
            name = `${edgeType}_${edgeParas.sourceHandle}-${edgeParas.targetHandle}`;
        } else {
            const sepIndex = edgeType.indexOf("$$");
            metaType = edgeType.substr(sepIndex + 2);
            metaModel = edgeType.substr(0, sepIndex);
            name = `${metaType}__${edgeParas.sourceHandle}-${edgeParas.targetHandle}`;
        }
        if (edgeParas.source != null && edgeParas.target != null) {
            if (edgeType === AssociationMetatype) {
                await CreateAssociations(modelName, name, edgeParas.source, edgeParas.target, -1, -1, -1, -1, -1, -1);
            } else if (edgeType === GeneralizationMetatype) {
                await CreateGeneralization(modelName, name, edgeParas.source, edgeParas.target, -1, -1);
                edge.style = GeneralizationEdgeStyle;
                edge.type = GeneralizationEdgeType;
            } else {
                await InstantiateAssociation(modelName, name, metaModel, metaType, edgeParas.source, edgeParas.target);
            }
            await AddSimpleAttribute(modelName, name, 'sourceHandle', -1, -1);
            await AddSimpleAttribute(modelName, name, 'targetHandle', -1, -1);
            await AddSimpleSlot(modelName, name, 'sourceHandle', `${edgeParas.sourceHandle}`, -1, -1);
            await AddSimpleSlot(modelName, name, 'targetHandle', `${edgeParas.targetHandle}`, -1, -1);
        }
        edge.id = name;
        edge.label = name;
        setElements((elements: Elements) => addEdge(edgeParas, elements));
    };

    const onDrop = async (event: DragEvent) => {
        event.preventDefault();
        if (reactFlowInstance) {
            const metaInfo = event.dataTransfer.getData('application/reactflow');
            const sepIndex = metaInfo.indexOf("$$");
            const pictureSepIndex = metaInfo.indexOf("%%");
            const metaType = pictureSepIndex > -1 ? metaInfo.substr(sepIndex + 2, metaInfo.length - sepIndex - pictureSepIndex + 2)
                : metaInfo.substr(sepIndex + 2);
            const metaModel = metaInfo.substr(0, sepIndex);
            const id = Math.round(Math.random() * 10000000).toString();
            const name = metaType + "_" + id;
            const node = await InstantiateNode(modelName, name, metaModel, metaType);
            if (node !== undefined) {
                const position = reactFlowInstance.project({x: event.clientX, y: event.clientY - 40});
                await AddSimpleAttribute(modelName, name, 'xCoordinate', -1, -1);
                await AddSimpleAttribute(modelName, name, 'yCoordinate', -1, -1);
                await AddSimpleSlot(modelName, name, 'xCoordinate', `${event.clientX}`, -1, -1);
                await AddSimpleSlot(modelName, name, 'yCoordinate', `${event.clientY - 40}`, -1, -1);
                let newNode: Node;
                if (modelName === 'RobotsQRealModel') {
                    const picture = metaInfo.substr(pictureSepIndex + 2);
                    newNode = {
                        id: name,
                        type: 'robotsQRealNode',
                        position,
                        data: {
                            label: ''
                        },
                        style: {
                            backgroundImage: `url(${picture})`,
                            width: '50px',
                            height: '50px',
                        }
                    };
                } else {
                    newNode = {
                        id: name,
                        type: 'default',
                        position,
                        data: {
                            label: node.name
                        },
                    };
                }
                setElements((es: Elements) => es.concat(newNode));
            } else {
                console.error("Some error on adding element");
            }
        }
    };

    const onNodeDragStop = (event: MouseEvent, node: Node) => {
        elements
            .filter(e => e.id === node.id)
            .forEach(async e => {
                await SetSimpleSlotValue(modelName, e.id, 'xCoordinate', `${node.position.x}`);
                await SetSimpleSlotValue(modelName, e.id, 'yCoordinate', `${node.position.y}`);
            });
    }

    const onEdgeUpdate = async (oldEdge: Edge, newConnection: Connection) => {
        if (oldEdge.target === newConnection.target && oldEdge.source === newConnection.source) {
            await SetSimpleSlotValue(modelName, oldEdge.id, 'sourceHandle', `${newConnection.sourceHandle}`);
            await SetSimpleSlotValue(modelName, oldEdge.id, 'targetHandle', `${newConnection.targetHandle}`);
            setElements((els) => updateEdge(oldEdge, newConnection, els));
            return;
        }

        await DeleteElement(modelName, oldEdge.id);
        let metaType: string = "", metaModel: string = "";
        if (edgeType !== AssociationMetatype && edgeType !== GeneralizationMetatype) {
            const sepIndex = edgeType.indexOf("$$");
            metaType = edgeType.substr(sepIndex + 2);
            metaModel = edgeType.substr(0, sepIndex);
        }
        if (newConnection.source != null && newConnection.target != null) {
            if (edgeType === AssociationMetatype) {
                await CreateAssociations(modelName, oldEdge.id, newConnection.source, newConnection.target, -1, -1, -1, -1, -1, -1);
            } else if (edgeType === GeneralizationMetatype) {
                await CreateGeneralization(modelName, oldEdge.id, newConnection.source, newConnection.target, -1, -1);
            } else {
                await InstantiateAssociation(modelName, oldEdge.id, metaModel, metaType, newConnection.source, newConnection.target);
            }
            await AddSimpleAttribute(modelName, oldEdge.id, 'sourceHandle', -1, -1);
            await AddSimpleAttribute(modelName, oldEdge.id, 'targetHandle', -1, -1);
            await AddSimpleSlot(modelName, oldEdge.id, 'sourceHandle', `${newConnection.sourceHandle}`, -1, -1);
            await AddSimpleSlot(modelName, oldEdge.id, 'targetHandle', `${newConnection.targetHandle}`, -1, -1);
        }
        setElements((els) => updateEdge(oldEdge, newConnection, els));
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
                onEdgeUpdate={onEdgeUpdate}
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