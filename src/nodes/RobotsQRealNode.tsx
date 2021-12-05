import React, {FC} from 'react';
import {Handle, Position, NodeProps} from 'react-flow-renderer';

import './RobotsQRealNode.css';

const robotsQRealNode: FC<NodeProps> = ({data}) => {
    return (
        <div className="robotsQRealNode">
            <Handle
                type="source"
                position={Position.Top}
                id="top"
                className="robotsQRealNodeHandle"
            />
            <Handle
                type="source"
                position={Position.Right}
                id="right"
                className="robotsQRealNodeHandle"
            />
            {data.label}
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                className="robotsQRealNodeHandle"
            />
            <Handle
                type="source"
                position={Position.Left}
                id="left"
                className="robotsQRealNodeHandle"
            />
        </div>
    );
};

export default robotsQRealNode;