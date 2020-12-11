import React from 'react';
import ReactFlow from 'react-flow-renderer';
import "./App.css"

const onLoad = (reactFlowInstance: { fitView: () => void; }) => {
    console.log('flow loaded:', reactFlowInstance);
};

const initialElements = [
    {
        id: '1',
        data: {
            label: (
                <>
                    This is a <strong>default node</strong>
                </>
            ),
        },
        position: {x: 100, y: 100},
    },
    {
        id: '2',
        data: {
            label: (
                <>
                    This is a <strong>another default node</strong>
                </>
            ),
        },
        position: {x: 250, y: 300},
    },
    {
        id: '3',
        data: {
            label: 'Node id: 3',
        },
        position: {x: 50, y: 400},
    },
    {
        id: 'e1-2',
        source: '1',
        target: '2',
        label: 'this is an edge label'
    },
    {
        id: 'e1-3',
        source: '1',
        target: '3'
    }
];

const OverviewFlow = () => {
    return (
        <div className="diagram-container">
            <ReactFlow
                elements={initialElements}
                onLoad={onLoad}
            >
            </ReactFlow>
        </div>
    );
};

export default OverviewFlow;