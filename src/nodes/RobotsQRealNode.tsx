import React, {FC} from 'react';
import {Handle, Position, NodeProps} from 'react-flow-renderer';

import './RobotsQRealNode.css';

const robotsQRealNode: FC<NodeProps> = ({data}) => {
    return (
        <div className="robotsQRealNode">
            <Handle
                type="source"
                position={Position.Top}
                id="1"
                className="robotsQRealNodeHandle"
            />
            <Handle
                type="source"
                position={Position.Right}
                id="2"
                className="robotsQRealNodeHandle"
            />
            {data.label}
            <Handle
                type="source"
                position={Position.Bottom}
                id="3"
                className="robotsQRealNodeHandle"
            />
            <Handle
                type="source"
                position={Position.Left}
                id="4"
                className="robotsQRealNodeHandle"
            />
        </div>
    );
};

export default robotsQRealNode;