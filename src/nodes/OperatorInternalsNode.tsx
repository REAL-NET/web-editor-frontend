import React, { FC } from 'react';
import { NodeProps } from 'react-flow-renderer';
import { ResizableBox } from 'react-resizable';

import './QueryNodes.css';

const operatorInternalsNode: FC<NodeProps> = ({data}) => {
    return (
        <div className='operatorInternalsNode'>
            <ResizableBox width={120} height={40} handle={<div className='nodeHandle'></div>} draggableOpts={{ grid: [5, 5] }} minConstraints={[120, 40]}>
                {/*<span>{data.label}</span>*/}
            </ResizableBox>
            <div className='nodeResizeHandle'></div>
        </div>
    );
};

export default operatorInternalsNode;