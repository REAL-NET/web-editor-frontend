import React, {FC, memo} from 'react';

import {Handle, NodeProps, Position} from 'react-flow-renderer';

const ImageNode: FC<NodeProps> = ({data}) => {
    return (
        <div>
            <Handle type="target" position={Position.Top}/>
            <div>
                {data.label}
            </div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
};

export default memo(ImageNode);