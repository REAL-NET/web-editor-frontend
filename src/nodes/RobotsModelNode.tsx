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
            {data.label}
            <Handle
                type="source"
                position={Position.Bottom}
                id="source"
                className="robotsNodeHandle"
            />
        </div>
    );
};

export default robotsModelNode;