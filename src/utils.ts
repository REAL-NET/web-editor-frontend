import {Errors, queryCheckWithErrorInfo} from "./requests/сonstraintsCheckRequests";
import React from "react";
import {Node, NodeChange, NodeRemoveChange} from "react-flow-renderer";
import {deleteElement, getEdge} from "./requests/elementRequests";
import {getModelEdges} from "./requests/modelRequests";

export const check = async (modelName: string, setCheckErrorInfo:  React.Dispatch<React.SetStateAction<number[]>>) => {
    const checkResult = await queryCheckWithErrorInfo(modelName);
    if (checkResult !== undefined) {
        if (!checkResult.result) {
            let codes: number[] = [];
            checkResult.errors.forEach((error: Errors) => codes.push(error.code));
            setCheckErrorInfo(codes);
        } else {
            setCheckErrorInfo([]);
        }
    }
}

export const deepDeleteElement = async (change: NodeRemoveChange, modelName: string, nodes: Node[]) => {
    const newChanges: NodeChange[] = [];
    const promises: Promise<any>[] = [];
    const deletedNode = nodes.find(node => node.id === change.id);
    if (deletedNode !== undefined && deletedNode.type === 'operatorInternalsNode') {
        const children = nodes.filter(node => node.parentNode === change.id);
        if (children.length > 0) {
            for (const child of children) {
                newChanges.push({type: 'remove', id: child.id});
                promises.push(deleteElement(modelName, +child.id));
            }
            const edgesModel: Array<{ id: number, name: string }> = await getModelEdges(modelName);
            const childEdges: number[] = [];
            await Promise.all(edgesModel.map(async (edgeModel) => {
                const edge = await getEdge(modelName, +edgeModel.id);
                if (edge !== undefined) {
                    const source = children.find(child => +child.id === edge.from.id)
                    const target = children.find(child => +child.id === edge.to.id)
                    if (source !== undefined || target !== undefined) {
                        childEdges.push(edge.id);
                        promises.push(deleteElement(modelName, edge.id));
                    } else {
                        const type = edge.attributes.find(attribute => attribute.name === 'type')?.stringValue ?? undefined;
                        if (type === 'internals') {
                            promises.push(deleteElement(modelName, edge.id));
                        }
                    }
                }
            }));
            childEdges.forEach(childEdge => {
                newChanges.push({type: 'remove', id: `${childEdge}`});
            })
        }
    }
    promises.push(deleteElement(modelName, +change.id));
    return {newChanges, promises};
}