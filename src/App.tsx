import React, { useState } from 'react';
import { OnLoadParams, ReactFlowProvider } from 'react-flow-renderer';

import Palette from './Palette';
import Scene from './Scene';
import { initialElements } from './initialElements';

import './App.css'


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