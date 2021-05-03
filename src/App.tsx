import React, {useState, useEffect} from 'react';
import {Elements, OnLoadParams, ReactFlowProvider} from 'react-flow-renderer';

import PropertyBar from './PropertyBar'
import Palette from './Palette';
import Scene from './Scene';
import {getMetamodel, getModelNodes, getModelEdges} from './requests/modelRequests';
import {getModelElements} from './requests/elementRequests';

import './App.css';

document.addEventListener('click', e => (e.target));

const OverviewFlow = () => {
    const modelName = 'RobotsTestModel';
    const metamodelName = 'RobotsMetamodel';

    const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
    const [elements, setElements] = useState<Elements>([]);
    const [captureElementClick, setCaptureElementClick] = useState<boolean>(true);
    const [currentElementId, setCurrentElementId] = useState<string>("");
    const [metamodel, setMetamodel] = useState<Array<{ id: number, name: string }>>([]);

    // metamodel
    useEffect(() => {
        getMetamodel(metamodelName).then(data => {
            let newMetamodel: Array<{ id: number, name: string }> = [];
            data.map((element: { id: number, name: string }) => {
                newMetamodel.push(element);
            })
            setMetamodel(newMetamodel);
        });
    }, []);

    // model
    useEffect(() => {
        Promise.all([getModelNodes(modelName), getModelEdges(modelName)]).then(value => {
                let nodes: Array<{ id: number, name: string }> = [];
                let edges: Array<{ id: number, name: string }> = [];
                if (value[0] !== undefined) {
                    value[0].forEach((element: { id: number, name: string }) => {
                        nodes.push(element);
                    });
                }
                if (value[1] !== undefined) {
                    value[1].forEach((element: { id: number, name: string }) => {
                        edges.push(element);
                    });
                }
                getModelElements(modelName, nodes, edges).then(data => setElements(data));
        });
    }, []);

    return (
        <div className="OverviewFlow">
            <ReactFlowProvider>
                <PropertyBar modelName={modelName} id={currentElementId} setElements={setElements} elements={elements}/>
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