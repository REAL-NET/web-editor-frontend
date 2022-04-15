import React, { FC } from 'react';
import { NodeProps } from 'react-flow-renderer';
import { ResizableBox } from 'react-resizable';

import './QueryNodes.css';

const materializationPlankNode: FC<NodeProps> = ({data}) => {
    return (
        <div className='materializationPlankNode'>
            <ResizableBox width={280} height={1} axis="x" handle={<div className='materializationPlankNodeResizeHandle'></div>} draggableOpts={{ grid: [5, 5] }} minConstraints={[200, 1]}>
                {/*<span>{data.label}</span>*/}
            </ResizableBox>
            <div className='materializationPlankNodeHandle'></div>
        </div>
    );
};

export default materializationPlankNode;