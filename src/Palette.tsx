import React, {DragEvent, useEffect, useState} from 'react';

import './Palette.css';
import './RobotsModelNode.css';
import './Nodes.css'

import {ElementInfo} from "./model/ElementInfo";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import {getElements} from "./initialElements";
import {AssociationMetatype, GeneralizationMetatype} from "./Constants";
import {AllModels, GetModel, GetModelMetaEdges, GetModelMetaNodes} from "./requests/deepModelRequests";

const onDragStart = (event: DragEvent, metaInfo: string) => {
    event.dataTransfer.setData('application/reactflow', metaInfo);
};

// const onDragStart = (event: DragEvent, nodeType: string, elementId: number) => {
//     event.dataTransfer.setData('application/reactflow', `${nodeType} ${elementId}`);
//     event.dataTransfer.effectAllowed = 'move';
// };

// const Palette = (props: { metamodelName: string }) => {
//     const [metamodel, setMetamodel] = useState<Array<{ id: number, name: string }>>([]);
//
//     useEffect(() => {
//         let newMetamodel: Array<{ id: number, name: string }> = [];
//         getModel(props.metamodelName).then(data => {
//             if (data !== undefined) {
//                 data.forEach((element: { id: number, name: string }) => {
//                     getAttributeValue(props.metamodelName, element.id, 'isAbstract').then(data => {
//                         if (data !== undefined && !data && element.name !== 'Link') {
//                             newMetamodel.push(element);
//                         }
//                     });
//                 });
//             }
//         }).finally(() => setMetamodel(newMetamodel));
//     }, []);
//
//     const getMetamodelElements = (modelName: string): ElementInfo[] => {
//         const nodes = await GetModelMetaNodes(modelName);
//         if (nodes === undefined || nodes.length === 0) {
//             console.error(`No meta nodes retrieved for ${modelName}`);
//             const model = await GetModel(modelName);
//             if (model === undefined) {
//                 console.error(`Model ${modelName} is not retrieved from repo`);
//                 return [];
//             }
//             let metamodel = await GetModel(model.metamodel.name);
//             if (metamodel === undefined) {
//                 console.error(`Metamodel ${metamodel} is not retrieved from repo`);
//                 return [];
//             }
//             return metamodel.nodes;
//         }
//         return nodes;
//     };
//
//     const getModelsMenuItems = () => {
//         const models = AllModels();
//         if (models === undefined) {
//             console.error("Models is not retrieved from repo");
//             return [];
//         }
//         return models.map(value => value.name);
//     };
//
//     const RobotsNodePaletteItem = (props: { element: { id: number; name: string } }) => {
//         return (
//             <div className="robotsNode" key={props.element.id}
//                  onDragStart={(event: DragEvent) => onDragStart(event, 'robotsNode', props.element.id)} draggable>
//                 {props.element.name}
//             </div>
//         );
//     }
//
//     const metamodelFiltered = metamodel.filter((element) => element.name !== '');
//     const metamodelElements = metamodelFiltered.map(element => <RobotsNodePaletteItem element={element} key={element.name + element.id}/>);
// }

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

type PaletteBarProps = {
    setElements: Function,
    modelName: string,
    setModelName: Function,
    edgeType: string,
    setEdgeType: Function
}

const Palette: React.FC<PaletteBarProps> = ({setElements, modelName, setModelName, edgeType, setEdgeType}) => {
    const [menuItems, setMenuItems] = useState<string[]>([]);
    const [edgesMetatypes, setEdgesMetatypes] = useState<ElementInfo[]>([]);
    const [metamodelElements, setMetamodelElements] = useState<ElementInfo[]>([]);

    useEffect(  () => {
        (async () => {
            setMenuItems(await getModelsMenuItems());
        })()
    }, []);

    useEffect(() => {
        (async () => {
            console.log('heh')
            setElements(await getElements(modelName));
            console.log('haha')
            setEdgesMetatypes(await getEdgesMetatypes(modelName));
            setMetamodelElements(await getMetamodelElements(modelName));
        })();
    }, [modelName]);

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

    const getModelsMenuItems = async () => {
        const models = await AllModels();
        if (models === undefined) {
            console.error("Models are not retrieved from repo");
            return [];
        }
        return models.map(value => value.name);
    };

    const PaletteItem = (props: { element: ElementInfo}) => {
        return (
            <div className="paletteNode" onDragStart={(event: DragEvent) =>
                     onDragStart(event, props.element.model.name + "$$" + props.element.name)} draggable>
                {props.element.model.name + "::" + props.element.name}
            </div>
        );
    }

    return (
        <aside>
            <div className="description">Palette</div>
            {/*{metamodelElements}*/}
            {/*Nodes with images*/}
            {/*<ImageNodeList />*/}
            <div>
                <InputLabel>Model:</InputLabel>
                <Select
                    id="modelName"
                    value={modelName}
                    onChange={(evt) => {
                        setModelName(evt.target.value as string);
                    }}
                >
                    {menuItems.map(value => <MenuItem key={value + "_" + Math.round(Math.random() * 10000000).toString()} value={value}>{value}</MenuItem>)}
                </Select>
            </div>
            <br/>
            <div className="description">
                <InputLabel>Edge:</InputLabel>
                <Select
                    id="edgeType"
                    value={edgeType}
                    onChange={(event => {
                        setEdgeType(event.target.value as string)
                    })}
                >
                    <MenuItem key='AssociationMetatype' value={AssociationMetatype}>{AssociationMetatype}</MenuItem>
                    <MenuItem key='GeneralizationMetatype' value={GeneralizationMetatype}>{GeneralizationMetatype}</MenuItem>
                    {edgesMetatypes.map(value =>
                            <MenuItem key={value.model.name + "$$" + value.name + "_" + Math.round(Math.random() * 10000000).toString()} value={value.model.name + "$$" + value.name}>
                                {value.model.name + "::" + value.name}
                            </MenuItem>
                    )}
                </Select>
            </div>
            <br/>
            <div className="description">
                <InputLabel>Elements:</InputLabel>
            </div>
            <br/>
            {metamodelElements.map(value => <PaletteItem key={value.model.name + "$$" + value.name + "_" + Math.round(Math.random() * 10000000).toString()} element={value}/>)}
        </aside>
    );
};

export default Palette;