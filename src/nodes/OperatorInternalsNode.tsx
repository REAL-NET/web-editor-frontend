import React, { FC } from 'react';
import { NodeProps } from 'react-flow-renderer';
import { ResizableBox } from 'react-resizable';

import './QueryNodes.css';

const operatorInternalsNode: FC<NodeProps> = ({data}) => {
    return (
        <div className='operatorInternalsNode'>
            <ResizableBox width={data.width} height={data.height} handle={<div className='nodeResizeHandle'></div>} draggableOpts={{ grid: [5, 5] }} minConstraints={[120, 40]}>
                {/*<span>{data.label}</span>*/}
            </ResizableBox>
            <div className='nodeHandle'></div>
        </div>
    );
};

export default operatorInternalsNode;