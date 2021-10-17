import React, {useState, useEffect} from 'react';
import {Elements, OnLoadParams, ReactFlowProvider} from 'react-flow-renderer';

import PropertyBar from './PropertyBar'
import Palette from './Palette';
import Scene from './Scene';
import {getModelNodes, getModelEdges} from './requests/modelRequests';
import {getModelElements} from './requests/elementRequests';
import { getElements } from './initialElements';

import './App.css'
import {AssociationMetatype} from "./Constants";

document.addEventListener('click', e => (e.target));

const OverviewFlow = () => {
    const modelName = 'RobotsTestModel';
    const metamodelName = 'RobotsMetamodel';

    const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
    const [modelName, setModelName] = useState("TestModel2");
    const [elements, setElements] = useState(getElements(modelName));
    const [elements, setElements] = useState<Elements>([]);
    const [captureElementClick, setCaptureElementClick] = useState<boolean>(true);
    const [currentElementId, setCurrentElementId] = useState<string>("");
    const [edgeType, setEdgeType] = useState(AssociationMetatype);
    const [level, setLevel] = useState(-1);
    const [potency, setPotency] = useState(-1);


    // model
    useEffect(() => {
        Promise.all([getModelNodes(modelName), getModelEdges(modelName)]).then(data => {
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
            getModelElements(modelName, nodes, edges).then(modelElements => setElements(modelElements));
        });
    }, []);

    return (
        <div className="OverviewFlow">
            <ReactFlowProvider>
                <PropertyBar id={currentElementId}
                             setElements={setElements}
                             elements={elements}
                             modelName={modelName}
                             setCurrentElementId={setCurrentElementId}
                             level={level}
                             setLevel={setLevel}
                             potency={potency}
                             setPotency={setPotency}
                />
                <Scene
                    modelName={modelName}
                    metamodelName={metamodelName}
                    elements={elements}
                    setElements={setElements}
                    reactFlowInstance={reactFlowInstance}
                    setReactFlowInstance={setReactFlowInstance}
                    setCurrentElementId={setCurrentElementId}
                    captureElementClick={captureElementClick}
                    edgeType={edgeType}
                    setLevel={setLevel}
                    setPotency={setPotency}
                />
                <Palette
                    setElements={setElements}
                    modelName={modelName}
                    metamodelName={metamodelName}
                    setModelName={setModelName}
                    edgeType={edgeType}
                    setEdgeType={setEdgeType}
                />
            </ReactFlowProvider>
        </div>
    );
};

export default OverviewFlow;