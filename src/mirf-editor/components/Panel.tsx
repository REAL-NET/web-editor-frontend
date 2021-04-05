import React, { DragEvent } from 'react';
import { useStoreState, Node, Edge } from 'react-flow-renderer';
import { PipelineNodeProps } from '../types';

const onDragStart = (event: DragEvent, nodeType: string) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const convertToPipelineNode = (node: Node, edges: Array<Edge>) => {
  const children = edges.filter(e => e.source === node.id).map(e => e.target);
  const newNode = {
    ...node.data as PipelineNodeProps,
    children
  };
  return newNode;
}

function saveToJson(nodes: Array<Node>, edges: Array<Edge>): void {
  const pipeline = nodes.map(n => convertToPipelineNode(n, edges));
  const pipelineJson = JSON.stringify(pipeline);
  console.log(pipelineJson);
}

const Panel = () => {
  let nodes = useStoreState((store) => store.nodes);
  let edges = useStoreState((store) => store.edges);

  function onClick(e: any) {
    e.preventDefault();
    saveToJson(nodes, edges);
  }

  return (
    <aside>
      <div className="description">Pipeline blocks</div>
      <div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, 'mirf')} draggable>
        ecgReader
      </div>
      <div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, 'mirf')} draggable>
        readDicomImageSeries
      </div>
      <div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, 'mirf')} draggable>
        ecgBeatExtractor
      </div>
      <div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, 'mirf')} draggable>
        ecgClassifier
      </div>
      <div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, 'mirf')} draggable>
        ecgCleaner
      </div>
      <div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, 'mirf')} draggable>
        collectionData
      </div>
      <button onClick={onClick}>
        Save
      </button>
    </aside>
  );
};

export default Panel;
