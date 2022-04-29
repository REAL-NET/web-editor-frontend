import React, {FC, useState} from 'react';
import {applyEdgeChanges, Edge, EdgeChange, EdgeProps} from 'react-flow-renderer';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import '../QueryElements.css';
import {deleteElement} from "../../requests/elementRequests";

const RemoteEdge: FC<EdgeProps> = ({
                                       id,
                                       sourceX,
                                       sourceY,
                                       targetX,
                                       targetY,
                                       data
                                   }) => {
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(contextMenu === null ? {mouseX: event.clientX - 2, mouseY: event.clientY - 4} : null);
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const onDelete = async () => {
        deleteElement(data.modelName, +data.id);
        const changes: EdgeChange[] = [{id: `${data.id}`, type: 'remove'}];
        data.setEdges((edges: Edge[]) => applyEdgeChanges(changes, edges));
        setContextMenu(null);
    };

    const path = `M ${sourceX},${sourceY}L ${targetX},${targetY}`;

    return (
        <>
            <path
                id={id}
                className="remoteEdge"
                d={path}
                markerEnd="url(#arrow)"
                onContextMenu={handleContextMenu}
                style={{cursor: 'context-menu'}}
            />
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
                        markerWidth="6" markerHeight="6"
                        orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z"/>
                </marker>
            </defs>
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={contextMenu !== null ? {top: contextMenu.mouseY, left: contextMenu.mouseX} : undefined}
            >
                <MenuItem onClick={onDelete}>Delete</MenuItem>
            </Menu>
        </>
    );
};

export default RemoteEdge;