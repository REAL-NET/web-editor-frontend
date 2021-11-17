import React, {FC} from 'react';
import {Handle, Position, NodeProps} from 'react-flow-renderer';

import './RobotsQRealNode.css';

const robotsQRealNode: FC<NodeProps> = ({data}) => {
    return (
        <div className="robotsQRealNode">
            <Handle
                type="target"
                position={Position.Top}
                id="target_1"
                className="robotsQRealNodeHandle"
            />
            <Handle
                type="target"
                position={Position.Right}
                id="target_2"
                className="robotsQRealNodeHandle"
            />
            <Handle
                type="target"
                position={Position.Left}
                id="target_3"
                className="robotsQRealNodeHandle"
            />
            <Handle
                type="target"
                position={Position.Bottom}
                id="target_4"
                className="robotsQRealNodeHandle"
            />
            {data.label}
            <Handle
                type="source"
                position={Position.Top}
                id="source_1"
                className="robotsQRealNodeHandle"
            />
            <Handle
                type="source"
                position={Position.Right}
                id="source_2"
                className="robotsQRealNodeHandle"
            />
            <Handle
                type="source"
                position={Position.Left}
                id="source_3"
                className="robotsQRealNodeHandle"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="source_4"
                className="robotsQRealNodeHandle"
            />
        </div>
    );
};

export default robotsQRealNode;