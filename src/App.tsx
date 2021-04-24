import React, { useState } from 'react';
import { OnLoadParams, ReactFlowProvider } from 'react-flow-renderer';

import PropertyBar from './PropertyBar'
import Palette from './Palette';
import Scene from './Scene';
import { getElements } from './initialElements';

import './App.css'
import {AssociationMetatype} from "./Constants";

document.addEventListener('click', e => (e.target));

const OverviewFlow = () => {
    const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
    const [modelName, setModelName] = useState("TestModel2");
    const [elements, setElements] = useState(getElements(modelName));
    const [captureElementClick, setCaptureElementClick] = useState<boolean>(true);
    const [currentElementId, setCurrentElementId] = useState<string>("");
    const [edgeType, setEdgeType] = useState(AssociationMetatype);

    return (
        <div className="OverviewFlow">
            <ReactFlowProvider>
                <PropertyBar id={currentElementId}
                             setElements={setElements}
                             elements={elements}
                             modelName={modelName}
                             setCurrentElementId={setCurrentElementId}
                />
                <Scene
                    elements={elements}
                    setElements={setElements}
                    reactFlowInstance={reactFlowInstance}
                    setReactFlowInstance={setReactFlowInstance}
                    setCurrentElementId={setCurrentElementId}
                    captureElementClick={captureElementClick}
                    modelName={modelName}
                    edgeType={edgeType}
                />
                <Palette
                    setElements={setElements}
                    modelName={modelName}
                    setModelName={setModelName}
                    edgeType={edgeType}
                    setEdgeType={setEdgeType}
                />
            </ReactFlowProvider>
        </div>
    );
};


export default OverviewFlow;