import React, {useEffect, useState} from 'react';
import {Elements, isNode, isEdge} from 'react-flow-renderer';
import {MenuItem, Select, Checkbox, TextField, InputLabel} from '@material-ui/core';

import {getNodeAttributes, getEdgeAttributes, setAttributeValue} from './requests/attributesRequests';
import {Attribute} from './Attribute';
import {setElementName} from './requests/elementRequests';

import './PropertyBar.css';

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
                        label: name,
                    };
                    setElementName(modelName, idNumber, name);
                }
                return el;
            })
        );
    }, [name, setElements]);

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