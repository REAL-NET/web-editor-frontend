import React, { FC } from 'react';
import { NodeProps } from 'react-flow-renderer';
import { ResizableBox } from 'react-resizable';

import './QueryNodes.css';

const readerNode: FC<NodeProps> = ({data}) => {
    return (
        <div className='readerNode'>
            <ResizableBox width={80} height={30} handle={<div className='nodeHandle'></div>} draggableOpts={{ grid: [5, 5] }} minConstraints={[80, 30]}>
                <span>{data.label}</span>
            </ResizableBox>
            <div className='nodeResizeHandle'></div>
        </div>
    );
};

export default readerNode;