import React, {useState, DragEvent} from 'react';
import ReactFlow, {
    OnLoadParams,
    ReactFlowProvider,
} from 'react-flow-renderer';

import "./App.css"
import Palette from './DragNDrop/Palette';
import './DragNDrop/dnd.css'
import Scene from './Scene';
import {initialElements} from "./initialElements";

const OverviewFlow = () => {
    const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
    const [elements, setElements] = useState(initialElements);
    return (
        <div className="OverviewFlow">
            <ReactFlowProvider>
                <Scene elements={elements}
                       setElements={setElements}
                       reactFlowInstance={reactFlowInstance}
                       setReactFlowInstance={setReactFlowInstance}/>
                <Palette/>
            </ReactFlowProvider>
        </div>
    );
};


export default OverviewFlow;