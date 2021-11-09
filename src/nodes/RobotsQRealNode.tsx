import React, {FC} from 'react';
import {Handle, Position, NodeProps} from 'react-flow-renderer';

import './RobotsQRealNode.css';

const robotsQRealNode: FC<NodeProps> = ({data}) => {
    return (
        <div className="robotsQRealNode">
            <Handle
                type="target"
                position={Position.Top}
                id="target"
                className="robotsQRealNodeHandle"
            />
            {data.label}
            <Handle
                type="source"
                position={Position.Bottom}
                id="source"
                className="robotsQRealNodeHandle"
            />
        </div>
    );
};

export default robotsQRealNode;