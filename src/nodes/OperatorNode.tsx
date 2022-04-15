import React, { FC } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { ResizableBox } from 'react-resizable';

import './QueryNodes.css';

const operatorNode: FC<NodeProps> = ({data}) => {
    return (

        <div className='operatorNode'>
            <Handle
                type="source"
                position={Position.Top}
                id="source1"
            />
            <ResizableBox width={80} height={30} handle={<div className='nodeResizeHandle'></div>} draggableOpts={{ grid: [5, 5] }} minConstraints={[80, 30]}>
                <span className='label'>{data.label}</span>
            </ResizableBox>
            <Handle
                type="source"
                position={Position.Bottom}
                id="source2"
            />
            <div className='nodeHandle'></div>
        </div>
    );
};

export default operatorNode;