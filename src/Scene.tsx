import React, {DragEvent, MouseEvent, useEffect} from 'react';
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
import {setAttributeValue} from './requests/attributeRequests';
import {deleteElement, addEdgeElement, getEdge, addNodeElement} from './requests/elementRequests';
import {FlowTransform} from "react-flow-renderer/dist/types";
import {
    AssociationMetatype,
    GeneralizationEdgeStyle,
    GeneralizationEdgeType,
    GeneralizationMetatype
} from "./Constants";
import {
    CreateAssociations,
    CreateGeneralization, DeleteElement,
    GetElement,
    InstantiateAssociation,
    InstantiateNode
} from "./requests/deepElementRequests";
import {AllModels} from "./requests/deepModelRequests";

type SceneProps = {
    modelName: string
    // metamodelName: string
    elements: Elements
    setElements: React.Dispatch<React.SetStateAction<Elements>>
    reactFlowInstance: OnLoadParams | undefined
    setReactFlowInstance: Function
    setCurrentElementId: Function
    captureElementClick: boolean
    edgeType: string,
    setLevel: Function,
    setPotency: Function
}

const nodeTypes = {
    robotsNode: RobotsModelNode,
    imageNode: ImageNode,
};

// const Scene: React.FC<SceneProps> = ({
//                                          modelName, metamodelName, elements, setElements, reactFlowInstance,
//                                          setReactFlowInstance, setCurrentElementId, captureElementClick
//                                      }) => {
const Scene: React.FC<SceneProps> = ({ elements, setElements, reactFlowInstance,
                                         setReactFlowInstance, setCurrentElementId, captureElementClick, modelName, edgeType,
                                     setLevel, setPotency}) => {
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
        console.debug("On drag over")
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onElementsRemove = (elementsToRemove: Elements): void => {
        console.debug("On elements remove")
        elementsToRemove.forEach(async value => {
            await DeleteElement(modelName, value.id);
        });
        setElements((elements: Elements) => removeElements(elementsToRemove, elements));
        elementsToRemove.forEach(async element => {
            await deleteElement(modelName, +element.id);
        })
    };

    const onLoad = async (_reactFlowInstance: OnLoadParams) => {
        let models = await AllModels();
        console.log('flow loaded:', reactFlowInstance);
        setReactFlowInstance(_reactFlowInstance);
    };

    const onConnect = async (edgeParas: Edge | Connection) => {
        // addEdgeElement(metamodelName, modelName, edgeParas.source !== null ? +edgeParas.source : -1,
        //     edgeParas.target !== null ? +edgeParas.target : -1).then((id: string) => {
        //     if (id !== '') {
        //         getEdge(modelName, +id).then(edge => {
        //             const newLink = {
        //                 id: `${edge.id}`,
        //                 source: `${edgeParas.source}`,
        //                 target: `${edgeParas.target}`,
        //                 label: `${edge.name}`
        //             }
        //             setElements((es: Elements) => es.concat(newLink));
        //         });
        //     }
        // });
        console.debug("On elements connect");
        const edge = edgeParas as Edge;
        let name: string, metaType: string = "", metaModel: string = "";
        if (edgeType === AssociationMetatype || edgeType === GeneralizationMetatype) {
            name = `${edgeType}_${Math.round(Math.random() * 10000000).toString()}`;
        } else {
            const sepIndex = edgeType.indexOf("$$");
            metaType = edgeType.substr(sepIndex + 2);
            metaModel = edgeType.substr(0, sepIndex);
            name = `${metaType}_${Math.round(Math.random() * 10000000).toString()}`;
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
            console.debug(edgeParas);
        }
        edge.id = name;
        edge.label = name;
        setElements((elements: Elements) => addEdge(edgeParas, elements));
        console.log('elements:', elements);
    };

    let id = 0;
    const getId = function (): string {
        while (elements.find(item => item.id === `${id}`) !== undefined) {
            ++id;
        }
        return `${id}`;
    };

    const onDrop = async (event: DragEvent) => {
        console.log("On elements drop")
        event.preventDefault();
        if (reactFlowInstance) {
            const metaInfo = event.dataTransfer.getData('application/reactflow');
            const sepIndex = metaInfo.indexOf("$$");
            const metaType = metaInfo.substr(sepIndex + 2);
            const metaModel = metaInfo.substr(0, sepIndex);
            const id = Math.round(Math.random() * 10000000).toString();
            const name = metaType + "_" + id;
            console.log(`${modelName}, ${name}, ${metaModel}, ${metaType}`)
            const node = await InstantiateNode(modelName, name, metaModel, metaType);
            if (node !== undefined) {
                const position = reactFlowInstance.project({x: event.clientX, y: event.clientY - 40});
                console.log(node.name)
                const newNode: Node = {
                    id: name,
                    type: 'default',
                    position,
                    data: {label: node.name},
                };
                setElements((es: Elements) => es.concat(newNode));
            } else {
                console.error("Some error on adding element");
            }
            //
            // const data = event.dataTransfer.getData('application/reactflow').split(' ');
            // const type = data[0];
            // const position = reactFlowInstance.project({x: event.clientX - 280, y: event.clientY - 40});
            //
            // let newNode: Node;
            // if (type === 'ImageNode') {
            //     newNode = {
            //         id: getId(),
            //         type: 'imageNode',
            //         position,
            //         data: {label: `${type}`},
            //         style: {
            //             backgroundImage: data[1],
            //             height: Number(data[2]),
            //             width: Number(data[3]),
            //             border: '1px solid #777',
            //             borderRadius: 2,
            //             display: "flex",
            //             justifyContent: "center",
            //             alignItems: 'center',
            //         }
            //     };
            //     setElements((es: Elements) => es.concat(newNode));
            // } else {
            //     const parentsId = data[1];
            //     addNodeElement(modelName, +parentsId, type, position.x, position.y).then(node => {
            //         setElements((es: Elements) => es.concat(node));
            //     })
            // }
        }
    };

    // // Scene node stops being dragged/moved
    // const onNodeDragStop = (event: MouseEvent, node: Node) => {
    //     event.preventDefault();
    //     setAttributeValue(modelName, +node.id, 'xCoordinate', `${node.position.x}`);
    //     setAttributeValue(modelName, +node.id, 'yCoordinate', `${node.position.y}`);
    // };

    const onNodeDragStop = (event: MouseEvent, node: Node) => {
        elements
            .filter(e => e.id === node.id)
            .forEach(e => (e as Node).position = node.position);
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