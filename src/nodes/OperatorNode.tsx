import React, { FC } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { ResizableBox } from 'react-resizable';

import './QueryNodes.css';
import {setAttributeValue} from "../requests/attributeRequests";

const operatorNode: FC<NodeProps> = ({data}) => {
    const onResizeStop = (event: any, {size}: any) => {
        if (data.id !== undefined && data.modelName !== undefined) {
            if (data.width !== size.width) {
                setAttributeValue(data.modelName, data.id, 'width', size.width);
            }
            if (data.height !== size.height) {
                setAttributeValue(data.modelName, data.id, 'height', size.height);
            }
        }
    };

    return (
        <div className='operatorNode'>
            <Handle
                type="source"
                position={Position.Top}
                id="portLeft"
            />
            <ResizableBox width={data.width} height={data.height}
                          handle={<div className={`nodeResizeHandle ${!data.isSelected ? 'hidden' : ''}`}></div>}
                          draggableOpts={{ grid: [5, 5] }} minConstraints={[80, 30]} onResizeStop={onResizeStop}>
                <span className='label'>{data.label}</span>
            </ResizableBox>
            {/*<Handle*/}
            {/*    type="source"*/}
            {/*    position={Position.Bottom}*/}
            {/*    id="portRight"*/}
            {/*/>*/}
            <div className='nodeHandle'></div>
        </div>
    );
};

export default operatorNode;