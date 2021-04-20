import React, {useState, useEffect} from 'react';
import {OnLoadParams, ReactFlowProvider} from 'react-flow-renderer';

import PropertyBar from './PropertyBar'
import Palette from './Palette';
import Scene from './Scene';
import {initialElements} from './initialElements';
import {getModel, getMetamodel} from "./modelRequests";

import './App.css';

document.addEventListener('click', e => (e.target));

const OverviewFlow = () => {
    const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
    const [elements, setElements] = useState(initialElements);
    const [captureElementClick, setCaptureElementClick] = useState<boolean>(true);
    const [currentElementId, setCurrentElementId] = useState<string>("");
    const [metamodel, setMetamodel] = useState<Array<{ id: number, name: string }>>([]);
    const [model, setModel] = useState<Array<{ id: number, name: string }>>([]);

    // metamodel
    useEffect(() => {
        getMetamodel().then(data => {
            let newMetamodel: Array<{ id: number, name: string }> = [];
            data.map((element: { id: number, name: string }) => {
                newMetamodel.push(element);
            })
            setMetamodel(newMetamodel);
        });
    }, []);

    // model
    useEffect(() => {
        getModel().then(data => {
            let newModel: Array<{ id: number, name: string }> = [];
            data.map((element: { id: number, name: string }) => {
                newModel.push(element);
            })
            setModel(newModel);
        });
    }, []);

    return (
        <div className="OverviewFlow">
            <ReactFlowProvider>
                <PropertyBar id={currentElementId} setElements={setElements} elements={elements}/>
                <Scene
                    elements={elements}
                    setElements={setElements}
                    reactFlowInstance={reactFlowInstance}
                    setReactFlowInstance={setReactFlowInstance}
                    setCurrentElementId={setCurrentElementId}
                    captureElementClick={captureElementClick}
                />
                <Palette metamodel={metamodel}/>
            </ReactFlowProvider>
        </div>
    );
};

export default OverviewFlow;