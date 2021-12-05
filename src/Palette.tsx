import React, {DragEvent, useEffect, useState} from 'react';

import './Palette.css';
import './nodes/RobotsModelNode.css';
import './nodes/RobotsQRealNode.css';
import './nodes/nodesWithImages/ImageNode.css'

import {ElementInfo} from "./model/ElementInfo";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import {getElements} from "./initialElements";
import {AssociationMetatype, GeneralizationMetatype} from "./Constants";
import {AllModels, GetModel, GetModelMetaEdges, GetModelMetaNodes} from "./requests/deepModelRequests";
import {GetSlot} from "./requests/deepElementRequests";

type PaletteBarProps = {
    setElements: Function,
    modelName: string,
    setModelName: Function,
    edgeType: string,
    setEdgeType: Function,
    isDeep: boolean
}

const Palette: React.FC<PaletteBarProps> = ({setElements, modelName, setModelName, edgeType, setEdgeType, isDeep}) => {
    const [menuItems, setMenuItems] = useState<string[]>([]);
    const [edgesMetatypes, setEdgesMetatypes] = useState<ElementInfo[]>([]);
    const [metamodelElements, setMetamodelElements] = useState<ElementInfo[]>([]);
    const [metamodelElementsList, setMetamodelElementsList] = useState<JSX.Element[]>([]);

    let uniqueId = 0;
    const getNextUniqueId = () => {
        uniqueId += 1;
        return uniqueId;
    }

    useEffect(() => {
        (async () => {
            setMenuItems(await getModelsMenuItems());
        })()
    }, []);

    useEffect(() => {
        (async () => {
            setElements(await getElements(modelName));
            if (isDeep) {
                setEdgesMetatypes(await getEdgesMetatypes(modelName));
            }
            setMetamodelElements(await getMetamodelElements(modelName));
        })();
    }, [modelName]);

    const PaletteItem = (props: { element: ElementInfo }) => {
        return (
            <div className="paletteNode" onDragStart={(event: DragEvent) =>
                onDragStart(event, props.element.model.name + "$$" + props.element.name)} draggable>
                {props.element.model.name + "::" + props.element.name}
            </div>
        );
    }

    const RobotsQRealPaletteNode = (props: { element: ElementInfo, picture: string }) => {
        return (
            <div className='robotsQRealNodeContainer'>
                <div className="robotsQRealNode"
                     onDragStart={(event: DragEvent) => onDragStart(event, props.element.model.name + '$$' + props.element.name + '%%' +
                                props.picture)}
                     draggable
                     style={{
                         backgroundImage: `url(${props.picture})`,
                         width: '50px',
                         height: '50px'
                     }}/>
                <div className='robotsQRealNodeName'>
                    {props.element.name}
                </div>
            </div>
        );
    }

    useEffect(() => {
        (async () => {
            let newMetamodelElementsList: JSX.Element[] = [];
            for (const metamodelElement of metamodelElements) {
                let picture: string | undefined = undefined;
                if (modelName === 'RobotsQRealModel') {
                    picture = (await GetSlot(metamodelElement.model.name, metamodelElement.name, 'Image'))?.simpleValue;
                }
                if (picture !== undefined) {
                    newMetamodelElementsList.push(RobotsQRealPaletteNode({
                        element: metamodelElement,
                        picture: picture
                    }));
                } else {
                    newMetamodelElementsList.push(PaletteItem({element: metamodelElement}));
                }
            }
            setMetamodelElementsList(newMetamodelElementsList);
        })();
    }, [metamodelElements]);

    const getModelsMenuItems = async () => {
        const models = await AllModels();
        if (models === undefined) {
            console.error("Models are not retrieved from repo");
            return [];
        }
        return models.map(value => value.name);
    };

    const getMetamodelElements = async (modelName: string) => {
        const nodes = await GetModelMetaNodes(modelName);
        if (nodes === undefined || nodes.length === 0) {
            console.error(`No meta nodes retrieved for ${modelName}`);
            const model = await GetModel(modelName);
            if (model === undefined) {
                console.error(`Model ${modelName} is not retrieved from repo`);
                return [];
            }
            if (model.metamodel !== undefined) {
                let metamodel = await GetModel(model.metamodel.name);
                if (metamodel === undefined) {
                    console.error(`Metamodel ${metamodel} is not retrieved from repo`);
                    return [];
                }
                return metamodel.nodes;
            }
            console.error(`No metamodel is found in repo`);
            return [];
        }
        return nodes;
    };

    const getEdgesMetatypes = async (modelName: string) => {
        const edges = await GetModelMetaEdges(modelName);
        if (edges === undefined) {
            console.error(`No meta edges retrieved for ${modelName}`);
            const model = await GetModel(modelName);
            if (model === undefined) {
                console.error(`Model ${modelName} is not retrieved from repo`);
                return [];
            }
            const metamodel = await GetModel(model.metamodel.name);
            if (metamodel === undefined) {
                console.error(`Metamodel ${metamodel} is not retrieved from repo`);
                return [];
            }
            return metamodel.relationships;
        }
        return edges;
    };

    const onDragStart = (event: DragEvent, metaInfo: string) => {
        event.dataTransfer.setData('application/reactflow', metaInfo);
    };

    return (
        <aside>
            <div className="description">Palette</div>
            <div className='paletteMenuContainer'>
                <InputLabel>Model:</InputLabel>
                <Select
                    id="modelName"
                    value={modelName}
                    onChange={(evt) => {
                        setModelName(evt.target.value as string);
                    }}
                >
                    {menuItems?.map(value =>
                        <MenuItem key={value + "_" + getNextUniqueId().toString()} value={value}>
                            {value}
                        </MenuItem>
                    )}
                </Select>
            </div>
            <div className='paletteMenuContainer' hidden={!isDeep}>
                <InputLabel>Edge:</InputLabel>
                <Select
                    id="edgeType"
                    value={edgeType}
                    onChange={(event => {
                        setEdgeType(event.target.value as string)
                    })}
                >
                    <MenuItem key='AssociationMetatype' value={AssociationMetatype}>{AssociationMetatype}</MenuItem>
                    <MenuItem key='GeneralizationMetatype'
                              value={GeneralizationMetatype}>{GeneralizationMetatype}</MenuItem>
                    {edgesMetatypes.map(value =>
                        <MenuItem
                            key={value.model.name + "$$" + value.name + "_" + getNextUniqueId()}
                            value={value.model.name + "$$" + value.name}>
                            {value.model.name + "::" + value.name}
                        </MenuItem>
                    )}
                </Select>
            </div>
            <div className='paletteMenuContainer'>
                <InputLabel>Elements:</InputLabel>
                {metamodelElementsList}
            </div>
        </aside>
    );
};

export default Palette;