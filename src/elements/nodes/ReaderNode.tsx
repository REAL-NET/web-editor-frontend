import React, {FC, useState} from 'react';
import {applyNodeChanges, Handle, Node, NodeProps, Position} from 'react-flow-renderer';
import {ResizableBox} from 'react-resizable';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import '../QueryElements.css';
import {setAttributeValue} from "../../requests/attributeRequests";
import {check, deepDeleteElement} from "../../utils";

const ReaderNode: FC<NodeProps> = ({data}) => {
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
        const result = await deepDeleteElement({id: `${data.id}`, type: 'remove'}, data.modelName, data.nodes.current);
        let changes = result.newChanges;
        data.setNodes((nodes: Node[]) => applyNodeChanges(changes, nodes));
        setContextMenu(null);
        await Promise.all(result.promises);
        check(data.modelName, data.setCheckErrorInfo);
    };

    const onResizeStop = (event: any, {size}: any) => {
        if (data.id !== undefined && data.modelName !== undefined) {
            if (data.width !== size.width) {
                data.width = size.width;
                setAttributeValue(data.modelName, data.id, 'width', size.width);
            }
            if (data.height !== size.height) {
                data.height = size.height;
                setAttributeValue(data.modelName, data.id, 'height', size.height);
            }
        }
    };

    return (
        <div onContextMenu={handleContextMenu} style={{cursor: 'context-menu'}}>
            <div className='readerNode'>
                <Handle
                    className="port"
                    type="source"
                    position={Position.Top}
                    id="portTop"
                />
                <Handle
                    className="port"
                    type="source"
                    position={Position.Left}
                    id="portLeft"
                />
                <ResizableBox width={data.width} height={data.height}
                              handle={<div className={`nodeResizeHandle ${!data.isSelected ? 'hidden' : ''}`}></div>}
                              draggableOpts={{grid: [5, 5]}} minConstraints={[80, 30]} onResizeStop={onResizeStop}>
                    <span className='label'>{data.label}</span>
                </ResizableBox>
                <Handle
                    className="port"
                    type="source"
                    position={Position.Bottom}
                    id="portBottom"
                />
                <Handle
                    className="port"
                    type="source"
                    position={Position.Right}
                    id="portRight"
                />
                <div className='nodeHandle'></div>
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

export default ReaderNode;