import React, { FC } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';

import './RobotsModelNode.css';

const robotsModelNode: FC<NodeProps> = ({data}) => {
    return (
        <div className="robotsNode">
            <Handle
                type="target"
                position={Position.Top}
                id="target"
                className="robotsNodeHandle"
            />
            {data.name}
            <Handle
                type="source"
                position={Position.Bottom}
                id="source"
                className="robotsNodeHandle"
            />
            {/*<Handle*/}
            {/*    type="target"*/}
            {/*    position={Position.Right}*/}
            {/*    id="t2"*/}
            {/*    className="robotsNodeHandle"*/}
            {/*/>*/}
        </div>
    );
};

export default robotsModelNode;