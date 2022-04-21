import React, { FC } from 'react';
import {Handle, NodeProps, Position} from 'react-flow-renderer';
import { ResizableBox } from 'react-resizable';

import './QueryNodes.css';

const readerNode: FC<NodeProps> = ({data}) => {
    return (
        <div className='readerNode'>
            <Handle
                type="source"
                position={Position.Top}
                id="portLeft"
            />
            <ResizableBox width={data.width} height={data.height}
                          handle={<div className={`nodeResizeHandle ${!data.isSelected ? 'hidden' : ''}`}></div>}
                          draggableOpts={{ grid: [5, 5] }} minConstraints={[80, 30]}>
                <span className='label'>{data.label}</span>
            </ResizableBox>
            {/*<Handle*/}
            {/*    type="source"*/}
            {/*    position={Position.Right}*/}
            {/*    id="portRight"*/}
            {/*/>*/}
            <div className='nodeHandle'></div>
        </div>
    );
};

export default readerNode;