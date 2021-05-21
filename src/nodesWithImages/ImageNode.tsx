import React, {FC, memo} from 'react';

import {Handle, NodeProps, Position} from 'react-flow-renderer';


const ImageNode: FC<NodeProps> = ({data}) => {
    return (
        <>
            <Handle type="target" position={Position.Top}/>
            <Handle type="source" position={Position.Bottom}/>
            <div>
                Image Node: <strong>{data.color}</strong>
            </div>
        </>
    );
};

export default memo(ImageNode);