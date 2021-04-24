import React, {DragEvent, useEffect} from 'react';
import './PropertyBar.css'
import './Nodes.css'
import {RepoAPI} from "./repo/RepoAPI";
import {ElementInfo} from "./model/ElementInfo";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import {getElements} from "./initialElements";
import {MiniMap} from "react-flow-renderer";
import {AssociationMetatype, GeneralizationMetatype} from "./Constants";

const onDragStart = (event: DragEvent, metaInfo: string) => {
    event.dataTransfer.setData('application/reactflow', metaInfo);
    event.dataTransfer.effectAllowed = 'move';
};

const getMetamodelElements = (modelName: string): ElementInfo[] => {
    const nodes = RepoAPI.GetModelMetaNodes(modelName);
    if (nodes === undefined || nodes.length === 0) {
        console.error(`No meta nodes retrieved for ${modelName}`);
        const model = RepoAPI.GetModel(modelName);
        if (model === undefined) {
            console.error(`Model ${modelName} is not retrieved from repo`);
            return [];
        }
        let metamodel = RepoAPI.GetModel(model.metamodel.name);
        if (metamodel === undefined) {
            console.error(`Metamodel ${metamodel} is not retrieved from repo`);
            return [];
        }
        return metamodel.nodes;
    }
    return nodes;
};

const getModelsMenuItems = () => {
    const models = RepoAPI.AllModels();
    if (models === undefined) {
        console.error("Models is not retrieved from repo");
        return [];
    }
    return models.map(value => value.name);
};

const getEdgesMetatypes = (modelName: string) => {
    const edges = RepoAPI.GetModelMetaEdges(modelName);
    if (edges === undefined) {
        console.error(`No meta edges retrieved for ${modelName}`);
        const model = RepoAPI.GetModel(modelName);
        if (model === undefined) {
            console.error(`Model ${modelName} is not retrieved from repo`);
            return [];
        }
        let metamodel = RepoAPI.GetModel(model.metamodel.name);
        if (metamodel === undefined) {
            console.error(`Metamodel ${metamodel} is not retrieved from repo`);
            return [];
        }
        return metamodel.relationships;
    }
    return edges;
};

type PaletteBarProps = {
    setElements: Function,
    modelName: string,
    setModelName: Function,
    edgeType: string,
    setEdgeType: Function
}

const Palette: React.FC<PaletteBarProps>  = ({ setElements, modelName, setModelName, edgeType, setEdgeType }) => {

    useEffect(() => {
        setElements(() => getElements(modelName));
    }, [modelName, setElements])

    return (
        <aside>
            <div>
                <InputLabel>Model:</InputLabel>
                <Select
                    id="modelName"
                    value={modelName}
                    onChange={(evt) => {
                        setModelName(evt.target.value as string);
                    }}>
                    {getModelsMenuItems().map(value => <MenuItem value={value}>{value}</MenuItem>)}
                </Select>
            </div>
            <br/>
            <div className="description">
                <InputLabel>Edge:</InputLabel>
                <Select
                    id="edgeType"
                    value={edgeType}
                    onChange={(event => {setEdgeType(event.target.value as string)})}
                >
                    <MenuItem value={AssociationMetatype}>{AssociationMetatype}</MenuItem>
                    <MenuItem value={GeneralizationMetatype}>{GeneralizationMetatype}</MenuItem>
                    {
                        getEdgesMetatypes(modelName).map(value =>
                            <MenuItem value={value.model.name + "$$" +value.name}>{value.model.name + "::" +value.name}</MenuItem> )
                    }
                </Select>
            </div>
            <br/>
            <div className="description">
                <InputLabel>Elements:</InputLabel>
            </div>
            <br/>
            {getMetamodelElements(modelName).map(value => {
                return <div className="dndnode" onDragStart={(event: DragEvent) =>
                    onDragStart(event, value.model.name + "$$" +value.name)} draggable>
                    {value.model.name + "::" + value.name}
                </div>
            })}
        </aside>
    );
};

export default Palette;