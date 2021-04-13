import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHotkeys } from 'react-hotkeys-hook';
import { OnLoadParams, ReactFlowProvider } from 'react-flow-renderer';

import PropertyBar from './PropertyBar'
import Palette from './Palette';
import Scene from './Scene';
import { initialElements } from './initialElements';
import api from './api';
import { getModel, getMetamodel } from "./modelRequests";

import './App.css';

document.addEventListener('click', e => (e.target));

const OverviewFlow = () => {
    const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
    const [elements, setElements] = useState(initialElements);
    const [captureElementClick, setCaptureElementClick] = useState<boolean>(true);
    const [currentElementId, setCurrentElementId] = useState<string>("");
    const [metamodel, setMetamodel] = useState<Array<{ id: number, name: string }>>([]);
    const [model, setModel] = useState<Array<{ id: number, name: string }>>([]);

    useHotkeys('delete', () => console.log("Delete pressed"));

    useEffect(() => {
        getMetamodel().then(data => {
            let newMetamodel: Array<{ id: number, name: string }> = [];
            data.map((element: { id: number, name: string }) => {
                newMetamodel.push(element);
            })
            setMetamodel(newMetamodel);
        });
    }, []);

    getModel().then(data => {
        data.map((element: { id: number, name: string }) => {
            model.push(element);
        })
    });

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