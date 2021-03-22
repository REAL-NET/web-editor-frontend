import React, { FC } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';

const customNode: FC<NodeProps> = ({data}) => {
    return (
        <div style={{border: '1px solid #777', padding: 10, background: '#00FF00'}}>
            <Handle type="target" position={Position.Left} style={{borderRadius: 0}}/>
            <div>{data.text}</div>
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                style={{top: '30%', borderRadius: 0}}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="b"
                style={{top: '70%', borderRadius: 0}}
            />
        </div>
    );
};

export default customNode;