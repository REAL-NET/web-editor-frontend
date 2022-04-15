import React, { FC } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { ResizableBox } from 'react-resizable';

import './QueryNodes.css';

const operatorNode: FC<NodeProps> = ({data}) => {
    return (
        // <div className="operatorNode">
        //     <Handle
        //         type="target"
        //         position={Position.Top}
        //         id="target"
        //         className="robotsNodeHandle"
        //     />
        //     {data.label}
        //     <Handle
        //         type="source"
        //         position={Position.Bottom}
        //         id="source"
        //         className="robotsNodeHandle"
        //     />
        // </div>
        <div className='operatorNode'>
            <ResizableBox width={80} height={30} handle={<div className='nodeHandle'></div>} draggableOpts={{ grid: [5, 55] }} minConstraints={[80, 30]}>
                <span>{data.label}</span>
            </ResizableBox>
            <div className='nodeResizeHandle'></div>
        </div>
    );
};

export default operatorNode;