import React, {useEffect, useState, useRef} from "react";
import {Elements, isNode, isEdge, Edge} from "react-flow-renderer";
import {MenuItem, Select, Checkbox, TextField, InputLabel, Button, FormLabel} from "@material-ui/core";

import './Palette.css'
import './Nodes.css'
import AttributeDialog from "./dialogs/AttributeDialog";
import SlotDialog from "./dialogs/SlotDialog";
import {Attribute} from './model/Attribute';
import {Slot} from "./model/Slot";

import './PropertyBar.css';
import {
    GetAttributes, GetElement,
    GetSlots,
    SetElementLevel,
    SetElementName,
    SetElementPotency
} from "./requests/deepElementRequests";

type PropertyBarProps = {
    modelName: string
    elements: Elements
    id: string
    setElements: Function
    setCurrentElementId: Function,
}

const PropertyBar: React.FC<PropertyBarProps> = ({ elements, setElements, id, modelName, setCurrentElementId}) => {

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

    //edge states
    const [edgeIsAnimated, setEdgeIsAnimated] = useState(false);
    const [edgeType, setEdgeType] = useState('');

    const [attributes, setAttributes] = useState<Attribute[] | undefined>([]);
    const [slots, setSlots] = useState<Slot[] | undefined>([]);
    const [level, setLevel] = useState(-1);
    const [potency, setPotency] = useState(-1);

    function useFirstRender() {
        const firstRender = useRef(true);

        useEffect(() => {
            firstRender.current = false;
        }, []);

        return firstRender.current;
    }
    const firstRender = useFirstRender();

    const attributesAndSlots =
         (
            <div>
                <br/>
                <FormLabel>Attributes:</FormLabel>
                <br/>
                {
                    attributes?.map(value =>
                        <div key={value + "_" + Math.round(Math.random() * 10000000).toString()}>
                            <label>{value.name}: {value.type.name} L:{value.level} P:{value.potency}</label>
                            <br/>
                        </div>)
                }
                <Button onClick={() => setAddAttributeOpen(true)} fullWidth={true}>Add Attribute</Button>
                <AttributeDialog open={addAttributeOpen} setOpen={setAddAttributeOpen} modelName={modelName} elementName={element?.id || ""}
                    setAttributes={setAttributes}/>
                <br/>
                <FormLabel>Slots:</FormLabel>
                <br/>
                {
                    slots?.map(value =>
                        <div key={value + "_" + Math.round(Math.random() * 10000000).toString()}>
                            <label>{value.attribute.name}: {value.value.name} L:{value.level} P:{value.potency}</label>
                            <br/>
                        </div>)
                }
                <Button onClick={() => setAddSlotOpen(true)} fullWidth={true}>Add Slot</Button>
                <SlotDialog open={addSlotOpen} setOpen={setAddSlotOpen} modelName={modelName} elementName={element?.id || ""}
                    setSlots={setSlots}/>
            </div>
        )

    //common effects
    useEffect(() => {
        if (element  !== undefined) {
            if (!firstRender) {
                (async () => {
                    setAttributes(await GetAttributes(modelName, element?.id || ""));
                    setSlots(await GetSlots(modelName, element?.id || ""));
                })();
            }
            if (isNode(element)) {
                setNodeIsDraggable(isNode(element) && (element.draggable || element.draggable === undefined)); // because if draggable undefined node is draggable
                setIsHidden((element.isHidden !== undefined) && element.isHidden);
                setNodeIsConnectable(isNode(element) && (element.connectable === true || element.connectable === undefined));
            } else if (isEdge(element)) {
                setEdgeIsAnimated(element.animated !== undefined && element.animated);
                if (element.type !== undefined) setEdgeType(element.type);
                else setEdgeType('undefined');
            }
            (async () => {
                const repoElement = await GetElement(modelName, element.id);
                if (repoElement !== undefined) {
                    setLevel(repoElement.level);
                    setPotency(repoElement.potency);
                }
            })();
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
        (async () => {
            setElements(await Promise.all(elements.map(async (el) => {
                if (el.id === id) {
                    if (elements.filter(e => e.id === name).length > 0) {
                        console.warn("Duplicated name");
                        return el;
                    }
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    const newElem = await SetElementName(modelName, el.id, name);
                    if (newElem === undefined) {
                        console.error("Error while applying new name");
                        return el;
                    }
                    el = {
                        ...el,
                        id: name
                    };
                    if (isEdge(el)) {
                        (el as Edge).label = name;
                    }
                    if (isNode(el) && el.data.label !== undefined) {
                        el.data.label = name;
                    }
                    elements.filter(e => isEdge(e)).forEach(edge => {
                        if (isEdge(edge) && edge.source === id) {
                            edge.source = name;
                        }
                        if (isEdge(edge) && edge.target === id) {
                            edge.target = name;
                        }
                    })
                    setCurrentElementId(name);
                }
                return el;
            })))
        })();
    }, [name, setElements]);

    useEffect(() => {
        if (element !== undefined) {
            (async () => {
                await SetElementLevel(modelName, element.id, level);
            })();
        }
    }, [level, setLevel]);

    useEffect(() => {
        if (element !== undefined) {
            (async () => {
                await SetElementPotency(modelName, element.id, potency);
            })();
        }
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

    // useEffect(() => {
    //     if (element !== undefined && isNode(element)) {
    //         let attributes: Array<Attribute> = [];
    //         getNodeAttributes(modelName, idNumber).then(data => {
    //             if (data !== undefined) {
    //                 data.map(attribute => attributes.push(attribute));
    //             }
    //
    //             const attributeElements: Array<JSX.Element> = [];
    //             attributes.forEach(attribute => {
    //                 const setAttribute = (newValue: string) => {
    //                     setAttributeValue(modelName, idNumber, attribute.name, newValue);
    //                 }
    //                 attributeElements.push(<TextFieldItem key={attribute.name + attribute.stringValue}
    //                                                       label={attribute.name} value={attribute.stringValue}
    //                                                       setFunc={setAttribute}/>);
    //             });
    //             setNodeAttributes(attributeElements);
    //         });
    //     }
    // }, [element]);

    // useEffect(() => {
    //     if (element !== undefined && isEdge(element)) {
    //         let attributes: Array<Attribute> = [];
    //         getEdgeAttributes(modelName, idNumber).then(data => {
    //             if (data !== undefined) {
    //                 data.map(attribute => attributes.push(attribute));
    //             }
    //
    //             const attributeElements: Array<JSX.Element> = [];
    //             attributes.forEach(attribute => {
    //                 const setAttribute = (newValue: string) => {
    //                     setAttributeValue(modelName, idNumber, attribute.name, newValue);
    //                 }
    //                 attributeElements.push(<TextFieldItem
    //                     key={attribute.name + attribute.stringValue}
    //                     label={attribute.name} value={attribute.stringValue}
    //                     setFunc={setAttribute}
    //                 />);
    //             });
    //             setEdgeAttributes(attributeElements);
    //         });
    //     }
    // }, [element]);

    // const CheckboxItem = (props: { label: string, value: boolean, setFunc: (isRequired: boolean) => void }) => {


    const TextFieldItem = (props: { label: string, value: string | number, setFunc: Function }) => {
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

    if (element !== undefined && isNode(element)) {
        return (
            <aside>
                <TextFieldItem label="Label" value={element.data.label} setFunc={setName}/>
                <TextFieldItem label="Level" value={level} setFunc={setLevel}/>
                <TextFieldItem label="Potency" value={potency} setFunc={setPotency}/>
                {attributesAndSlots}
                <TextFieldItem label="Background" value={nodeBg} setFunc={setNodeBg}/>
                <div>
                    <label>Hidden:</label>
                    <Checkbox
                        checked={isHidden}
                        onChange={(evt) => setIsHidden(evt.target.checked)}
                        size='small'
                    />
                </div>
                <div>
                    <label>Draggable:</label>
                    <Checkbox
                        checked={nodeIsDraggable}
                        onChange={(evt) => setNodeIsDraggable(evt.target.checked)}
                        size='small'
                    />
                </div>
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
                <TextFieldItem label="Label" value={element.label !== undefined ? element.label : ""} setFunc={setName}/>
                <TextFieldItem label="Level" value={level} setFunc={setLevel}/>
                <TextFieldItem label="Potency" value={potency} setFunc={setPotency}/>
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
    }
    else {
        return (
            <aside>
                <div className="description">Property bar</div>
            </aside>)
    }
};

export default PropertyBar;