import React, { DragEvent, MouseEvent } from 'react';
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
import {RepoAPI} from "./repo/RepoAPI";
import {FlowTransform} from "react-flow-renderer/dist/types";
import {
    AssociationMetatype,
    GeneralizationEdgeStyle,
    GeneralizationEdgeType,
    GeneralizationMetatype
} from "./Constants";

type SceneProps = {
    elements: Elements
    setElements: Function
    reactFlowInstance: OnLoadParams | undefined
    setReactFlowInstance: Function
    setCurrentElementId: Function
    captureElementClick: boolean
    modelName: string,
    edgeType: string,
    setLevel: Function,
    setPotency: Function
}


const Scene: React.FC<SceneProps> = ({ elements, setElements, reactFlowInstance,
                                         setReactFlowInstance, setCurrentElementId, captureElementClick, modelName, edgeType,
                                     setLevel, setPotency}) => {


    const onElementClick = (_: MouseEvent, element: FlowElement) => {
        console.log('click', element);
        setCurrentElementId(element.id);
        const repoElement = RepoAPI.GetElement(modelName, element.id);
        if (repoElement === undefined) {
            console.error("No element retrieved from repo");
            return;
        }
        setLevel(repoElement.level);
        setPotency(repoElement.potency);
    }


    const onDragOver = (event: DragEvent) => {
        console.debug("On drag over")
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };


    const onElementsRemove = (elementsToRemove: Elements): void => {
        console.debug("On elements remove")
        elementsToRemove.forEach(value => {
            RepoAPI.DeleteElement(modelName, value.id);
        });
        setElements((elements: Elements) => removeElements(elementsToRemove, elements));
        console.log('elements:', elements);
    };

    const onLoad = (_reactFlowInstance: OnLoadParams) => {
        let models = RepoAPI.AllModels();
        console.log(models);
        console.log('flow loaded:', reactFlowInstance);
        setReactFlowInstance(_reactFlowInstance);
    };

    const onConnect = (edgeParas: Edge | Connection): void => {
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
                RepoAPI.CreateAssociations(modelName, name, edgeParas.source, edgeParas.target, -1, -1, -1, -1, -1, -1);
            } else if (edgeType === GeneralizationMetatype) {
                RepoAPI.CreateGeneralization(modelName, name, edgeParas.source, edgeParas.target, -1, -1);
                edge.style = GeneralizationEdgeStyle;
                edge.type = GeneralizationEdgeType;
            } else {
                RepoAPI.InstantiateAssociation(modelName, name, metaModel, metaType, edgeParas.source, edgeParas.target);
            }
            console.debug(edgeParas);
        }
        edge.id = name;
        edge.label = name;
        setElements((elements: Elements) => addEdge(edgeParas, elements));
        console.log('elements:', elements);
    };


    const onDrop = (event: DragEvent) => {
        console.log("On elements drop")
        event.preventDefault();
        if (reactFlowInstance) {
            const metaInfo = event.dataTransfer.getData('application/reactflow');
            const sepIndex = metaInfo.indexOf("$$");
            const metaType = metaInfo.substr(sepIndex + 2);
            const metaModel = metaInfo.substr(0, sepIndex);
            const id = Math.round(Math.random() * 10000000).toString();
            const name = metaType + "_" + id
            let node = RepoAPI.InstantiateNode(modelName, name, metaModel, metaType);
            if (node !== undefined) {
                const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });
                const newNode: Node = {
                    id: name,
                    type: 'default',
                    position,
                    data: { label: node.name },
                };
                setElements((es: Elements) => es.concat(newNode));
            } else {
                console.error("Some error on adding element");
            }
        }

    };

    const onNodeDragStop = (event: MouseEvent, node: Node) => {
        elements
            .filter(e => e.id === node.id)
            .forEach(e => (e as Node).position = node.position);
    }

    return (
        <div className="Scene">
            <ReactFlow
                elements = {elements}
                onElementsRemove={onElementsRemove}
                onLoad={onLoad}
                onConnect={onConnect}
                deleteKeyCode={46}
                snapToGrid={true}
                snapGrid={[25, 25]}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onElementClick={captureElementClick ? onElementClick : undefined}
                onNodeDragStop={onNodeDragStop}
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