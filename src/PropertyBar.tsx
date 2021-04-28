import React, {ChangeEvent, useEffect, useState} from "react";
import {Elements, isNode, isEdge} from "react-flow-renderer";
import {MenuItem, Select, Checkbox, TextField, InputLabel} from "@material-ui/core";

import {getNodeAttributes, getEdgeAttributes} from "./requests/elementRequests";

import './PropertyBar.css'
import './Nodes.css'

type PropertyBarProps = {
    modelName: string
    elements: Elements
    setElements: Function
    id: string
}

const PropertyBar: React.FC<PropertyBarProps> = ({modelName, elements, setElements, id}) => {
    const element = elements.find(item => item.id === id)
    const idNumber: number = +id;

    //common states
    const [Name, setName] = useState("");
    const [isHidden, setIsHidden] = useState(false);

    //node states
    const [nodeBg, setNodeBg] = useState("");
    const [nodeIsDraggable, setNodeIsDraggable] = useState(true);
    const [nodeIsConnectable, setNodeIsConnectable] = useState(true);

    //edge states
    const [edgeIsAnimated, setEdgeIsAnimated] = useState(false);
    const [edgeType, setEdgeType] = useState('');

    //common effects
    useEffect(() => { // sets states for chosen element
        if ((element !== undefined) && isNode(element)) {

            setNodeIsDraggable(isNode(element) && (element.draggable || element.draggable === undefined)); // because if draggable undefined node is draggable
            setIsHidden((element.isHidden !== undefined) && element.isHidden);
            setNodeIsConnectable(isNode(element) && (element.connectable === true || element.connectable === undefined));

        } else if (element !== undefined && isEdge(element)) {

            setEdgeIsAnimated(element.animated !== undefined && element.animated);
            if (element.type !== undefined) setEdgeType(element.type);
            else setEdgeType('undefined');

        }
    }, [element])

    useEffect(() => {
        setElements((els: Elements) =>
            els.map((el) => {
                if (el.id === id) {
                    // when you update a simple type you can just update the value
                    el.isHidden = isHidden;
                }
                return el;
            })
        );
    }, [isHidden, setElements]);

    useEffect(() => {
        setElements((els: Elements) =>
            els.map((el) => {
                if (el.id === id) {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    el.data = {
                        ...el.data,
                        label: Name,
                    };
                }
                return el;
            })
        );
    }, [Name, setElements]);

    useEffect(() => {
        setElements((els: Elements) =>
            els.map((el) => {
                if (el.id === id) {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    el = {
                        ...el,
                        label: Name,
                    };
                }
                return el;
            })
        );
    }, [Name, setElements]);

    useEffect(() => {
        setElements((els: Elements) =>
            els.map((el) => {
                if (el.id === id && isNode(el)) {
                    // when you update a simple type you can just update the value
                    el.connectable = nodeIsConnectable;
                }
                return el;
            })
        );
    }, [nodeIsConnectable, setElements]);

    //node effects
    useEffect(() => {
        setElements((els: Elements) =>
            els.map((el) => {
                if (el.id === id && isNode(el)) {
                    // when you update a simple type you can just update the value
                    el.draggable = nodeIsDraggable;
                }
                return el;
            })
        );
    }, [nodeIsDraggable, setElements]);

    useEffect(() => {
        setElements((els: Elements) =>
            els.map((el) => {
                if (el.id === id) {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    el.style = {...el.style, backgroundColor: nodeBg};
                }
                return el;
            })
        );
    }, [nodeBg, setElements]);

    //edge effects
    useEffect(() => {
        setElements((els: Elements) =>
            els.map((el) => {
                if (isEdge(el) && el.id === id) {
                    // when you update a simple type you can just update the value
                    el.animated = edgeIsAnimated;
                }
                return el;
            })
        );
    }, [edgeIsAnimated, setElements]);

    useEffect(() => {
        setElements((els: Elements) =>
            els.map((el) => {
                if (isEdge(el) && el.id === id) {
                    // when you update a simple type you can just update the value
                    el.type = edgeType;
                }
                return el;
            })
        );
    }, [edgeType, setElements]);

    const CheckboxItem = (props: { label: string, value: boolean, setFunc: (isRequired: boolean) => void }) => {
        return (
            <div>
                <label>{props.label}:</label>
                <Checkbox
                    checked={props.value}
                    onChange={(event) => props.setFunc(event.target.checked)}
                    size="small"
                />
            </div>
        );
    }

    if (element !== undefined && isNode(element)) return (
        <aside>
            <div className="description">Property bar</div>
            <div>
                <label>Id: {id}</label>
            </div>
            <div>
                <TextField label="Label:" value={element.data.label}
                           onChange={(evt) => setName(evt.target.value)}/>
            </div>
            <div>
                <TextField label="Background:" value={nodeBg} onChange={(evt) => setNodeBg(evt.target.value)}/>
            </div>
            <CheckboxItem label="Hidden" setFunc={setIsHidden} value={isHidden} />
            <CheckboxItem label="Draggable" setFunc={setNodeIsDraggable} value={nodeIsDraggable} />
            <CheckboxItem label="Connectable" setFunc={setNodeIsConnectable} value={nodeIsConnectable} />
        </aside>)
    else if (element !== undefined && isEdge(element)) return (
        <aside>
            <div className="description">Property bar</div>
            <div>
                <label>Id: {id}</label>
            </div>
            <div>
                <TextField label="Label: " value={element.label}
                           onChange={(evt) => setName(evt.target.value)}/>
            </div>
            <CheckboxItem label="Hidden" setFunc={setIsHidden} value={isHidden} />
            <CheckboxItem label="Animated" setFunc={setEdgeIsAnimated} value={edgeIsAnimated} />
            <div>
                <InputLabel>Type</InputLabel>
                <Select
                    id="edgeType"
                    value={edgeType}
                    onChange={(evt) => setEdgeType(evt.target.value as string)}
                >
                    <MenuItem value={'default'}>default</MenuItem>
                    <MenuItem value={'straight'}>straight</MenuItem>
                    <MenuItem value={'step'}>step</MenuItem>
                    <MenuItem value={'smoothstep'}>smoothstep</MenuItem>
                </Select>
            </div>
        </aside>)
    else return (
            <aside>
                <div className="description">Property bar</div>
            </aside>)
};

export default PropertyBar;