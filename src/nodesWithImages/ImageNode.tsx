import React, {FC, memo} from 'react';

import {Connection, Edge, Handle, NodeProps, Position} from 'react-flow-renderer';

const onConnect = (params: Connection | Edge) => console.log('handle onConnect', params);


const ImageNode: FC<NodeProps> = ({ data }) => {
    return (
        <>
            <Handle type="target" position={Position.Top}  onConnect={onConnect} />
            <Handle type="source" position={Position.Bottom} />
            <div>
                Image Node: <strong>{data.color}</strong>
            </div>
        </>
    );
};

export default memo(ImageNode);