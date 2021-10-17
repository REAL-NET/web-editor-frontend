import React, {useEffect, useState} from 'react';
import {Elements, isNode, isEdge} from 'react-flow-renderer';
import {MenuItem, Select, Checkbox, TextField, InputLabel} from '@material-ui/core';
import React, {useEffect, useState, DragEvent, useRef} from "react";
import {Elements, isNode, isEdge, Edge, Node} from "react-flow-renderer";
import {MenuItem, Select, Checkbox, TextField, InputLabel, Button, FormLabel} from "@material-ui/core";

import './Palette.css'
import './Nodes.css'
import {RepoAPI} from "./repo/RepoAPI";
import AddAttributeDialog from "./dialogs/AddAttributeDialog";
import AddSlotDialog from "./dialogs/AddSlotDialog";
import { toInt } from "./Util";
import {getNodeAttributes, getEdgeAttributes, setAttributeValue} from './requests/attributesRequests';
import {Attribute} from './Attribute';
import {setElementName} from './requests/elementRequests';

import './PropertyBar.css';

type PropertyBarProps = {
    modelName: string
    elements: Elements
    setElements: React.Dispatch<React.SetStateAction<Elements>>
    id: string
    setElements: Function
    id: string,
    modelName: string,
    setCurrentElementId: Function,
    level: number,
    setLevel: Function,
    potency: number,
    setPotency: Function
}

const PropertyBar: React.FC<PropertyBarProps> = ({modelName, elements, setElements, id}) => {
const PropertyBar: React.FC<PropertyBarProps> = ({ elements, setElements, id, modelName, setCurrentElementId,
                                                 level, setLevel, potency, setPotency}) => {

    const element = elements.find(item => item.id === id)
    const idNumber: number = +id;

    const [addAttributeOpen, setAddAttributeOpen] = useState(false);
    const [addSlotOpen, setAddSlotOpen] = useState(false);

    //common states
    const [name, setName] = useState("");
    const [isHidden, setIsHidden] = useState(false);

    //node states
    const [nodeBg, setNodeBg] = useState("");
    const [nodeIsDraggable, setNodeIsDraggable] = useState(true);
    const [nodeIsConnectable, setNodeIsConnectable] = useState(true);
    const [nodeAttributes, setNodeAttributes] = useState<Array<JSX.Element>>([]);

    //edge states
    const [edgeIsAnimated, setEdgeIsAnimated] = useState(false);
    const [edgeType, setEdgeType] = useState('');
    const [edgeAttributes, setEdgeAttributes] = useState<Array<JSX.Element>>([]);

    const attributesAndSlots =
         (
            <div>
                <br/>
                <FormLabel>Attributes:</FormLabel>
                <br/>
                {
                    RepoAPI.GetAttributes(modelName, element?.id || "")?.map(value =>
                        <div>
                            <label>{value.name}: {value.type.name} L:{value.level} P:{value.potency}</label>
                            <br/>
                        </div>)
                }
                <Button onClick={() => setAddAttributeOpen(true)} fullWidth={true}>Add Attribute</Button>
                <AddAttributeDialog open={addAttributeOpen} setOpen={setAddAttributeOpen} modelName={modelName} elementName={element?.id || ""}/>
                <br/>
                <FormLabel>Slots:</FormLabel>
                <br/>
                {
                    RepoAPI.GetSlots(modelName, element?.id || "")?.map(value =>
                        <div>
                            <label>{value.attribute.name}: {value.value.name} L:{value.level} P:{value.potency}</label>
                            <br/>
                        </div>)
                }
                <Button onClick={() => setAddSlotOpen(true)} fullWidth={true}>Add Slot</Button>
                <AddSlotDialog open={addSlotOpen} setOpen={setAddSlotOpen} modelName={modelName} elementName={element?.id || ""}/>
            </div>
        )

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
    }, [element]);

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
                    if (isNode(el)) {
                        // it's important that you create a new object here
                        // in order to notify react flow about the change
                        el.data = {
                            ...el.data,
                            label: name,
                        };
                    } else {
                        el = {
                            ...el,
                            label: name,
                        };
                    }
                    setElementName(modelName, idNumber, name);
                    if (els.filter(e => e.id === Name).length > 0) {
                        console.warn("Duplicated name");
                        return el;
                    }
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    const newElem = RepoAPI.SetElementName(modelName, el.id, Name);
                    if (newElem === undefined) {
                        console.error("Error while applying new name");
                        return el;
                    }
                    el = {
                        ...el,
                        id: Name
                    };
                    if (isEdge(el)) {
                        (el as Edge).label = Name;
                    }
                    if (((el as Node).data !== undefined) && ((el as Node).data.label !== undefined)) {
                        el.data.label = Name;
                    }
                    els.filter(e => isEdge(e)).forEach(edge => {
                        if ((edge as Edge).source === id) {
                            (edge as Edge).source = Name
                        }
                        if ((edge as Edge).target === id) {
                            (edge as Edge).target = Name
                        }
                    })
                    setCurrentElementId(Name);
                }
                return el;
            })
        );
    }, [Name, setElements]);

    useEffect(() => {
        setElements((els: Elements) =>
            els.map((el) => {
                if (el.id === id) {
                    RepoAPI.SetElementLevel(modelName, el.id, level);
                }
                return el;
            })
        );
    }, [name, setElements]);
    }, [level, setLevel]);

    useEffect(() => {
        setElements((els: Elements) =>
            els.map((el) => {
                if (el.id === id) {
                    RepoAPI.SetElementPotency(modelName, el.id, potency);
                }
                return el;
            })
        );
    }, [potency, setPotency]);

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

    useEffect(() => {
        if (element !== undefined && isNode(element)) {
            let attributes: Array<Attribute> = [];
            getNodeAttributes(modelName, idNumber).then(data => {
                if (data !== undefined) {
                    data.map(attribute => attributes.push(attribute));
                }

                const attributeElements: Array<JSX.Element> = [];
                attributes.forEach(attribute => {
                    const setAttribute = (newValue: string) => {
                        setAttributeValue(modelName, idNumber, attribute.name, newValue);
                    }
                    attributeElements.push(<TextFieldItem key={attribute.name + attribute.stringValue}
                                                          label={attribute.name} value={attribute.stringValue}
                                                          setFunc={setAttribute}/>);
                });
                setNodeAttributes(attributeElements);
            });
        }
    }, [element]);

    useEffect(() => {
        if (element !== undefined && isEdge(element)) {
            let attributes: Array<Attribute> = [];
            getEdgeAttributes(modelName, idNumber).then(data => {
                if (data !== undefined) {
                    data.map(attribute => attributes.push(attribute));
                }

                const attributeElements: Array<JSX.Element> = [];
                attributes.forEach(attribute => {
                    const setAttribute = (newValue: string) => {
                        setAttributeValue(modelName, idNumber, attribute.name, newValue);
                    }
                    attributeElements.push(<TextFieldItem
                        key={attribute.name + attribute.stringValue}
                        label={attribute.name} value={attribute.stringValue}
                        setFunc={setAttribute}
                    />);
                });
                setEdgeAttributes(attributeElements);
            });
        }
    }, [element]);

    const CheckboxItem = (props: { label: string, value: boolean, setFunc: (isRequired: boolean) => void }) => {
        return (
            <aside>
                <div>
                    <TextField label="Label: " value={element.data.label}
                               onChange={(evt) => setName(evt.target.value)}/>
                </div>

                <div>
                    <TextField label="Level: " value={level}
                               onChange={(evt) => setLevel(toInt(evt.target.value))}/>
                </div>

                <div>
                    <TextField label="Potency: " value={potency}
                               onChange={(evt) => setPotency(toInt(evt.target.value))}/>
                </div>

                {attributesAndSlots}

                <div>
                    <TextField label="Background:" value={nodeBg} onChange={(evt) => setNodeBg(evt.target.value)}/>
                </div>

                <div>
                    <label>Hidden:</label>
                    <Checkbox
                        checked={isHidden}
                        onChange={(evt) => setIsHidden(evt.target.checked)}
                        size='small'
                    />
                </div>
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

    const TextFieldItem = (props: { label: string, value: string, setFunc: (newValue: string) => void }) => {
        const [textFieldValue, setTextFieldValue] = useState(props.value);

        return (
            <div>
                <TextField
                    label={props.label + ': '}
                    value={textFieldValue}
                    onChange={(event) => setTextFieldValue(event.target.value)}
                    onBlur={() => {
                        props.setFunc(textFieldValue);
                    }}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            props.setFunc(textFieldValue);
                        }
                    }}
                />
            </div>
        );
    }

                <div>
                    <label>Connectable:</label>
                    <Checkbox
                        size='small'
                        checked={nodeIsConnectable}
                        onChange={(evt) => setNodeIsConnectable(evt.target.checked)}
                    />
                </div>

            </aside>)
    } else if (element !== undefined && isEdge(element)) {
        return (
            <aside>

                <div>
                    <TextField label="Label: " value={element.label}
                               onChange={(evt) => setName(evt.target.value)}/>
                </div>

                <div>
                    <TextField label="Level: " value={level}
                               onChange={(evt) => setLevel(toInt(evt.target.value))}/>
                </div>

                <div>
                    <TextField label="Potency: " value={potency}
                               onChange={(evt) => setPotency(toInt(evt.target.value))}/>
                </div>

                {attributesAndSlots}

                <div>
                    <label>Hidden:</label>
                    <Checkbox
                        checked={isHidden}
                        onChange={(evt) => setIsHidden(evt.target.checked)}
                        size='small'
                    />
                </div>

                <div>
                    <label>Animated:</label>
                    <Checkbox
                        checked={edgeIsAnimated}
                        onChange={(evt) => setEdgeIsAnimated(evt.target.checked)}
                        size='small'
                    />
                </div>

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
    } else {
        return (
    if (element !== undefined && isNode(element)) return (
        <aside>
            <div className="description">Property bar</div>
            <div>
                <label>Id: {idNumber}</label>
            </div>
            <TextFieldItem label="Label" value={element.data.label} setFunc={setName}/>
            <TextFieldItem label="Background" value={nodeBg} setFunc={setNodeBg}/>
            <CheckboxItem label="Hidden" setFunc={setIsHidden} value={isHidden}/>
            <CheckboxItem label="Draggable" setFunc={setNodeIsDraggable} value={nodeIsDraggable}/>
            <CheckboxItem label="Connectable" setFunc={setNodeIsConnectable} value={nodeIsConnectable}/>
            {nodeAttributes}
        </aside>)
    else if (element !== undefined && isEdge(element)) return (
        <aside>
            <div className="description">Property bar</div>
            <div>
                <label>Id: {idNumber}</label>
            </div>
            <TextFieldItem label="Label" value={element.label !== undefined ? element.label : ""} setFunc={setName}/>
            <CheckboxItem label="Hidden" setFunc={setIsHidden} value={isHidden}/>
            <CheckboxItem label="Animated" setFunc={setEdgeIsAnimated} value={edgeIsAnimated}/>
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
            {edgeAttributes}
        </aside>)
    else return (
            <aside>
                <div className="description">Property bar</div>
            </aside>)
};

export default PropertyBar;