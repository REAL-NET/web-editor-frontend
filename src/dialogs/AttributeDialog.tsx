import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {toInt} from "../Util";
import {FormLabel, InputLabel, MenuItem, Select} from "@material-ui/core";
import {AddAttribute, GetAttributes} from "../requests/deepElementRequests";
import {GetModel, GetModelMetaNodes} from "../requests/deepModelRequests";
import {Model} from "../model/Model";
import {ElementInfo} from "../model/ElementInfo";
import {Attribute} from "../model/Attribute";

type AttributeDialogProps = {
    open: boolean,
    setOpen: Function,
    modelName: string,
    elementName: string,
    setAttributes: Function
}

const AttributeDialog: React.FC<AttributeDialogProps> = ({open, setOpen, modelName, elementName, setAttributes}) => {
    const [attributeName, setAttributeName] = useState("");
    const [level, setLevel] = useState(-1);
    const [potency, setPotency] = useState(-1);

    const [model, setModel] = useState<Model | undefined>();
    const [modelMetaNodes, setModelMetaNodes] = useState<ElementInfo[] | undefined>([]);

    useEffect(() => {
        (async () => {
            setModel(await GetModel(modelName));
            setModelMetaNodes(await GetModelMetaNodes(modelName));
        })()
    }, []);

    const availableTypes = [...(model?.nodes || []), ...(modelMetaNodes || [])]
        .map(value => `${value.model.name}::${value.name}`);

    const [typeName, setTypeName] = useState(availableTypes[0] || "");
    const [isNoError, setIsNoError] = useState(availableTypes.length > 0);

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = async () => {
        console.log(modelName);
        console.log(elementName);
        const sep = typeName.indexOf("::");
        const repoResp = await AddAttribute(modelName, elementName, attributeName,
            typeName.substr(0, sep), typeName.substr(sep + 2), level, potency);
        if (repoResp === undefined) {
            setIsNoError(false);
        } else {
            setAttributes((attributes: Attribute[]) => attributes.concat(repoResp));
            handleClose();
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Attribute</DialogTitle>
                <DialogContent>
                    <FormLabel style={{color: 'red'}} hidden={isNoError}>Error while adding attribute.</FormLabel>
                    <TextField
                        autoFocus
                        id="name"
                        label="Attribute name:"
                        type="email"
                        fullWidth
                        value={attributeName}
                        onChange={evt => setAttributeName(evt.target.value)}
                    />
                    <InputLabel style={{marginTop: '0.5rem'}}>Type:</InputLabel>
                    <Select
                        value={typeName}
                        onChange={evt => setTypeName(evt.target.value as string)}
                        fullWidth={true}
                    >
                        {
                            availableTypes.map(value => <MenuItem value={value}>{value}</MenuItem> )
                        }
                    </Select>
                    <br/>
                    <TextField
                        id="level"
                        label="Level:"
                        type="number"
                        value={level}
                        onChange={evt => setLevel(toInt(evt.target.value))}
                        style={{marginTop: '0.5rem'}}
                    />
                    <TextField
                        id="potency"
                        label="Potency:"
                        type="number"
                        value={potency}
                        onChange={evt => setPotency(toInt(evt.target.value))}
                        style={{marginTop: '0.5rem', marginLeft: '0.5rem'}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AttributeDialog;