import ReactFlow, { ReactFlowProvider, BackgroundVariant, removeElements, Background, addEdge, Controls, ArrowHeadType, Edge, Connection, Elements, updateEdge, 
    OnLoadParams,
    Node } from 'react-flow-renderer';
import React, { useState, DragEvent } from 'react';
import PipelineNode from './PipelineNode';
import Panel from './Panel';
import '../mirf.css';

let id = 0;
const getNodeId = () => `mirfNode_${id++}`;

const nodeTypes = {
    mirf: PipelineNode,
    ecgReader: PipelineNode,
    readDicomImageSeries: PipelineNode,
    ecgBeatExtractor: PipelineNode,
    ecgClassifier: PipelineNode,
    ecgCleaner: PipelineNode,
    collectionData: PipelineNode
};

let initialElements: Elements = [];

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

const MirfEditor = () => {
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>(initialElements);

  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge({...params, arrowHeadType: ArrowHeadType.ArrowClosed}, els));
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onLoad = (_reactFlowInstance: OnLoadParams) => setReactFlowInstance(_reactFlowInstance);
  const onEdgeUpdate = (oldEdge: any, newConnection: any) => setElements((els) => updateEdge(oldEdge, newConnection, els));

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    if (reactFlowInstance) {
      const type = event.dataTransfer.getData('application/reactflow');
      const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });
      const id = getNodeId();
      const newNode: Node = {
        id,
        type,
        position,
        data: { id , blockType: `${type} node` },
      };

      setElements((es) => es.concat(newNode));
    }
  };

  return (
    <div className="mirf-editor dndflow">
      <ReactFlowProvider>
        <Panel />
        <div className="reactflow-wrapper">
          <ReactFlow
            elements={elements}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes = { nodeTypes } 
            snapToGrid={true}
          >
            <Controls />
            <Background variant={BackgroundVariant.Lines} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default MirfEditor;