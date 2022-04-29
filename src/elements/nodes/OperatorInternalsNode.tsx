import React, {FC, useState} from 'react';
import {applyNodeChanges, NodeChange, NodeProps, Node} from 'react-flow-renderer';
import {ResizableBox} from 'react-resizable';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import '../QueryElements.css';
import {setAttributeValue} from "../../requests/attributeRequests";
import {check, deepDeleteElement} from "../../utils";

const OperatorInternalsNode: FC<NodeProps> = ({data}) => {
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
            if (data.height !== size.height) {
                data.height = size.height;
                setAttributeValue(data.modelName, data.id, 'height', size.height);
            }
        }
    };

    const fitNodes = async () => {
        if (data.id !== undefined && data.modelName !== undefined) {
            const node = data.nodes.current.find((nd: Node) => nd.id === `${data.id}`);
            if (node !== undefined) {
                const children = data.nodes.current.filter((nd: Node) => nd.parentNode === `${data.id}`);
                if (children !== undefined && children.length > 0) {
                    let top = Number.MAX_VALUE;
                    let bottom = Number.MIN_VALUE;
                    let left = Number.MAX_VALUE;
                    let right = Number.MIN_VALUE;
                    children.forEach((child: Node) => {
                        if (+child.position.y < top) {
                            top = +child.position.y;
                        }
                        if (+child.position.y + child.data.height > bottom) {
                            bottom = +child.position.y + child.data.height;
                        }
                        if (+child.position.x < left) {
                            left = +child.position.x;
                        }
                        if (+child.position.x + child.data.width > right) {
                            right = +child.position.x + child.data.width;
                        }
                    });
                    const oldPosition = {x: node.position.x, y: node.position.y};
                    const oldWidth = node.data.width;
                    const oldHeight = node.data.height;
                    const newPosition = {x: node.position.x + left - 10, y: node.position.y + top - 10};
                    if (newPosition.x !== oldPosition.x) {
                        node.position.x = newPosition.x;
                        setAttributeValue(data.modelName, data.id, 'xCoordinate', node.position.x);
                    }
                    if (newPosition.y !== oldPosition.y) {
                        node.position.y = newPosition.y;
                        setAttributeValue(data.modelName, data.id, 'yCoordinate', node.position.y);
                    }
                    const newHeight = bottom - node.position.y + oldPosition.y + 10;
                    if (newHeight !== oldHeight) {
                        node.data.height = newHeight;
                        setAttributeValue(data.modelName, data.id, 'height', newHeight);
                    }
                    const newWidth = right - node.position.x + oldPosition.x + 10;
                    if (newWidth !== oldWidth) {
                        node.data.width = newWidth;
                        setAttributeValue(data.modelName, data.id, 'width', newWidth);
                    }
                    const nodeCopy = Object.assign(Object.create(node), node);
                    const changes: NodeChange[] = [{id: node.id, type: 'remove'}];
                    data.setNodes((nodes: Node[]) => applyNodeChanges(changes, nodes).concat(nodeCopy));
                    for (const child of children) {
                        const newChildPosition = {x: child.position.x - left + 10, y: child.position.y - top + 10};
                        if (newChildPosition.x !== child.position.x) {
                            child.position.x = newChildPosition.x;
                            setAttributeValue(data.modelName, child.id, 'xCoordinate', `${newChildPosition.x}`);
                        }
                        if (newChildPosition.y !== child.position.y) {
                            child.position.y = newChildPosition.y;
                            setAttributeValue(data.modelName, child.id, 'yCoordinate', `${newChildPosition.y}`);
                        }
                    }
                }
            }
        }
    }

    return (
        <div onContextMenu={handleContextMenu} style={{cursor: 'context-menu'}}>
            <div className='operatorInternalsNode'>
                <ResizableBox width={data.width} height={data.height}
                              handle={<div className={`nodeResizeHandle ${!data.isSelected ? 'hidden' : ''}`}></div>}
                              draggableOpts={{grid: [5, 5]}} minConstraints={[120, 40]} onResizeStop={onResizeStop}>
                    {/*<span>{data.label}</span>*/}
                </ResizableBox>
                <div className={`resizeButton ${!data.isSelected ? 'hidden' : ''}`} onClick={fitNodes}></div>
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

export default OperatorInternalsNode;