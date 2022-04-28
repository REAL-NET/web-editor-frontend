import React, {useEffect, useState} from 'react';
import {isNode, isEdge, Node, Edge} from 'react-flow-renderer';
import {MenuItem, Select, Checkbox, TextField, InputLabel} from '@mui/material';

import {getNodeAttributes, getEdgeAttributes, setAttributeValue} from './requests/attributeRequests';
import {Attribute} from './Attribute';
import {setElementName} from './requests/elementRequests';

import './PropertyBar.css';

type PropertyBarProps = {
    modelName: string
    nodes: Node[]
    edges: Edge[]
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
    id: string
}

const PropertyBar: React.FC<PropertyBarProps> = ({modelName, nodes, edges, setNodes, setEdges, id}) => {
    const element = nodes.find(item => item.id === id) || edges.find(item => item.id === id);
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
            setIsHidden((element.hidden !== undefined) && element.hidden);
            setNodeIsConnectable(isNode(element) && (element.connectable === true || element.connectable === undefined));

        } else if (element !== undefined && isEdge(element)) {

            setEdgeIsAnimated(element.animated !== undefined && element.animated);
            if (element.type !== undefined) setEdgeType(element.type);
            else setEdgeType('undefined');

        }
    }, [idNumber]);

    useEffect(() => {
        setNodes((nodes: Node[]) =>
            nodes.map((node) => {
                if (node.id === id) {
                    node.hidden = isHidden;
                }
                return node;
            })
        );
        setEdges((edges: Edge[]) =>
            edges.map((edge) => {
                if (edge.id === id) {
                    edge.hidden = isHidden;
                }
                return edge;
            })
        );
    }, [isHidden, setNodes, setEdges]);

    useEffect(() => {
        setNodes((nodes: Node[]) =>
            nodes.map((node) => {
                if (node.id === id) {
                    node.data = {
                        ...node.data,
                        label: name,
                    };
                    setElementName(modelName, idNumber, name);
                }
                return node;
            })
        );
        setEdges((edges: Edge[]) =>
            edges.map((edge) => {
                if (edge.id === id) {
                    edge = {
                        ...edge,
                        label: name,
                    };
                    setElementName(modelName, idNumber, name);
                }
                return edge;
            })
        );
    }, [name, setNodes, setEdges]);

    useEffect(() => {
        setNodes((nodes: Node[]) =>
            nodes.map((node) => {
                if (node.id === id) {
                    node.connectable = nodeIsConnectable;
                }
                return node;
            })
        );
    }, [nodeIsConnectable, setNodes]);

    //node effects
    useEffect(() => {
        setNodes((nodes: Node[]) =>
            nodes.map((node) => {
                if (node.id === id) {
                    node.draggable = nodeIsDraggable;
                }
                return node;
            })
        );
    }, [nodeIsDraggable, setNodes]);

    useEffect(() => {
        setNodes((nodes: Node[]) =>
            nodes.map((node) => {
                if (node.id === id) {
                    node.style = {...node.style, backgroundColor: nodeBg};
                }
                return node;
            })
        );
    }, [nodeBg, setNodes]);

    //edge effects
    useEffect(() => {
        setEdges((edges: Edge[]) =>
            edges.map((edge) => {
                if (edge.id === id) {
                    edge.animated = edgeIsAnimated;
                }
                return edge;
            })
        );
    }, [edgeIsAnimated, setEdges]);

    useEffect(() => {
        setEdges((edges: Edge[]) =>
            edges.map((edge) => {
                if (edge.id === id) {
                    edge.type = edgeType;
                }
                return edge;
            })
        );
    }, [edgeType, setEdges]);

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
    }, [idNumber]);

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
    }, [idNumber]);

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
            <div className="textPropertyContainer">
                <TextField
                    variant="standard"
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
            <div className="textPropertyContainer">
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
            <TextFieldItem label="Label" value={typeof element.label === 'string' ? element.label : ""} setFunc={setName}/>
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