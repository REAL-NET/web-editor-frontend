import React, { FC } from 'react';
import { NodeProps } from 'react-flow-renderer';
import { ResizableBox } from 'react-resizable';

import './QueryNodes.css';

const materializationLineNode: FC<NodeProps> = ({data}) => {
    return (
        <div className='materializationLineNode'>
            <ResizableBox width={data.width} height={1} axis="x" handle={<div className='materializationLineNodeResizeHandle'></div>} draggableOpts={{ grid: [5, 5] }} minConstraints={[200, 1]}>
                {/*<span>{data.label}</span>*/}
            </ResizableBox>
            <div className='materializationLineNodeHandle'></div>
        </div>
    );
};

export default materializationLineNode;