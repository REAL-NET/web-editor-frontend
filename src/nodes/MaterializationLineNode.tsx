import React, { FC } from 'react';
import { NodeProps } from 'react-flow-renderer';
import { ResizableBox } from 'react-resizable';

import './QueryNodes.css';
import {setAttributeValue} from "../requests/attributeRequests";

const materializationLineNode: FC<NodeProps> = ({data}) => {
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
        <div className='materializationLineNode'>
            <ResizableBox width={data.width} height={1} axis="x"
                          handle={<div className={`materializationLineNodeResizeHandle ${!data.isSelected ? 'hidden' : ''}`}></div>}
                          draggableOpts={{ grid: [5, 5] }} minConstraints={[200, 1]} onResizeStop={onResizeStop}>
                {/*<span>{data.label}</span>*/}
            </ResizableBox>
            <div className='materializationLineNodeHandle'></div>
        </div>
    );
};

export default materializationLineNode;