import React, {FC, useState} from 'react';
import {applyNodeChanges, Node, NodeProps} from 'react-flow-renderer';
import {ResizableBox} from 'react-resizable';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import '../QueryElements.css';
import {setAttributeValue} from "../../requests/attributeRequests";
import {check, deepDeleteElement} from "../../utils";

const MaterializationLineNode: FC<NodeProps> = ({data}) => {
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
        let changes = await deepDeleteElement({id: `${data.id}`, type: 'remove'}, data.modelName, data.nodes.current);
        changes = changes.concat({id: `${data.id}`, type: 'remove'});
        data.setNodes((nodes: Node[]) => applyNodeChanges(changes, nodes));
        check(data.modelName, data.setCheckErrorInfo);
        setContextMenu(null);
    };

    const onResizeStop = (event: any, {size}: any) => {
        if (data.id !== undefined && data.modelName !== undefined) {
            if (data.width !== size.width) {
                data.width = size.width;
                setAttributeValue(data.modelName, data.id, 'width', size.width);
            }
        }
    };

    return (
        <div onContextMenu={handleContextMenu} style={{cursor: 'context-menu'}}>
            <div className='materializationLineNode'>
                <ResizableBox width={data.width} height={1} axis="x"
                              handle={<div
                                  className={`materializationLineNodeResizeHandle ${!data.isSelected ? 'hidden' : ''}`}></div>}
                              draggableOpts={{grid: [5, 5]}} minConstraints={[200, 1]} onResizeStop={onResizeStop}>
                    {/*<span>{data.label}</span>*/}
                </ResizableBox>
                <div className='materializationLineNodeHandle'></div>
            </div>
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={contextMenu !== null ? {top: contextMenu.mouseY, left: contextMenu.mouseX} : undefined}
            >
                <MenuItem onClick={onDelete}>Delete</MenuItem>
            </Menu>
        </div>
    );
};

export default MaterializationLineNode;