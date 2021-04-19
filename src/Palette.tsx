import React, {DragEvent, useEffect} from 'react';
import './PropertyBar.css'
import './Nodes.css'
import {RepoAPI} from "./repo/RepoAPI";
import {ElementInfo} from "./model/ElementInfo";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import {getElements} from "./initialElements";
const onDragStart = (event: DragEvent, metaInfo: string) => {
    event.dataTransfer.setData('application/reactflow', metaInfo);
    event.dataTransfer.effectAllowed = 'move';
};

const getMetamodelElements = (modelName: string): ElementInfo[] => {
    const nodes = RepoAPI.GetModelMetaNodes(modelName);
    if (nodes === undefined || nodes.length === 0) {
        console.error("No meta nodes retrieved");
        const model = RepoAPI.GetModel(modelName);
        if (model === undefined) {
            console.error("Model is not retrieved from repo");
            return [];
        }
        let metamodel = RepoAPI.GetModel(model.metamodel.name);
        if (metamodel === undefined) {
            console.error("Metamodel is not retrieved from repo");
            return [];
        }
        return metamodel.nodes;
    }
    return nodes;
}

const getModelsMenuItems = () => {
    const models = RepoAPI.AllModels();
    if (models === undefined) {
        console.error("Models is not retrieved from repo");
        return [];
    }
    return models.map(value => value.name);
}

type PaletteBarProps = {
    setElements: Function,
    modelName: string,
    setModelName: Function
}

const Palette: React.FC<PaletteBarProps>  = ({ setElements, modelName, setModelName }) => {

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
            <div className="description"><br/>Elements:</div>
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