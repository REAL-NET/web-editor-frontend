import React, {FC} from 'react';
import {EdgeProps} from 'react-flow-renderer';

import '../QueryElements.css';

const localEdge: FC<EdgeProps> = ({
                                      id,
                                      sourceX,
                                      sourceY,
                                      targetX,
                                      targetY,
                                  }) => {
    const path = `M ${sourceX},${sourceY}L ${targetX},${targetY}`;

    return (
        <>
            <path
                id={id}
                className="localEdge"
                d={path}
                markerEnd="url(#arrow)"
            />
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
                        markerWidth="6" markerHeight="6"
                        orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z"/>
                </marker>
            </defs>
        </>
    );
};

export default localEdge;