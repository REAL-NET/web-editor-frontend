import React, {useState} from 'react';
import {Elements, OnLoadParams, ReactFlowProvider} from 'react-flow-renderer';

import PropertyBar from './PropertyBar'
import Palette from './Palette';
import Scene from './Scene';

import './App.css'
import {AssociationMetatype} from "./Constants";

document.addEventListener('click', e => (e.target));

const OverviewFlow = () => {
    const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
    const [modelName, setModelName] = useState("RobotsQRealModel");
    const [elements, setElements] = useState<Elements>([]);
    const [captureElementClick,] = useState<boolean>(true);
    const [currentElementId, setCurrentElementId] = useState<string>("");
    const [edgeType, setEdgeType] = useState(AssociationMetatype);
    const [isDeep,] = useState(false);

    return (
        <div className="OverviewFlow">
            <ReactFlowProvider>
                <PropertyBar
                    id={currentElementId}
                    setElements={setElements}
                    elements={elements}
                    modelName={modelName}
                    setCurrentElementId={setCurrentElementId}
                    isDeep={isDeep}
                />
                <Scene
                    modelName={modelName}
                    elements={elements}
                    setElements={setElements}
                    reactFlowInstance={reactFlowInstance}
                    setReactFlowInstance={setReactFlowInstance}
                    setCurrentElementId={setCurrentElementId}
                    captureElementClick={captureElementClick}
                    edgeType={edgeType}
                />
                <Palette
                    setElements={setElements}
                    modelName={modelName}
                    setModelName={setModelName}
                    edgeType={edgeType}
                    setEdgeType={setEdgeType}
                    isDeep={isDeep}
                />
            </ReactFlowProvider>
        </div>
    );
};

export default OverviewFlow;