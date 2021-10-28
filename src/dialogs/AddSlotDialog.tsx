import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {toInt} from "../Util";
import {FormLabel, InputLabel, MenuItem, Select} from "@material-ui/core";
import {AddSlot, GetAttributes, GetValuesForAttribute} from "../requests/deepElementRequests";

type FormDialogProps = {
    open: boolean,
    setOpen: Function,
    modelName: string,
    elementName: string
}

const FormDialog: React.FC<FormDialogProps> = ({open, setOpen, modelName, elementName}) => {

    const [attributeName, setAttributeName] = useState("");
    const [level, setLevel] = useState(-1);
    const [potency, setPotency] = useState(-1);

    const [availableAttributes, setAvailableAttributes] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            setAvailableAttributes((await GetAttributes(modelName, elementName))?.map(value => value.name) || []);
        })()
    }, []);

    // const availableAttributes = await GetAttributes(modelName, elementName)?.map(value => value.name) || [];
    const [availableValues, setAvailableValues] = useState<string[]>([]);

    const [value, setValue] = useState(availableValues[0] || "");
    const [isNoError, setIsNoError] = useState(availableValues.length > 0);

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = async () => {
        console.log(modelName);
        console.log(elementName);
        const repoResp = await AddSlot(modelName, elementName, attributeName, value, level, potency);
        if (repoResp === undefined) {
            setIsNoError(false);
        } else {
            handleClose();
        }
    };

    const updateAttribute = async (newAttribute: string) => {
        setAttributeName(newAttribute);
        const availableValues = await GetValuesForAttribute(modelName, elementName, newAttribute) || [];
        setAvailableValues(availableValues.map(it => it.name));
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Slot</DialogTitle>
                <DialogContent>
                    <FormLabel style={{color: 'red'}} hidden={isNoError}>Error while adding slot.</FormLabel>
                    <InputLabel style={{marginTop: '0.5rem'}}>Attribute:</InputLabel>
                    <Select
                        value={attributeName}
                        onChange={evt => updateAttribute(evt.target.value as string)}
                        fullWidth={true}
                    >
                        {
                            availableAttributes.map(value => <MenuItem value={value}>{value}</MenuItem> )
                        }
                    </Select>
                    <InputLabel style={{marginTop: '0.5rem'}}>Value:</InputLabel>
                    <Select
                        value={value}
                        onChange={evt => setValue(evt.target.value as string)}
                        fullWidth={true}
                    >
                        {
                            availableValues.map(value => <MenuItem value={value}>{value}</MenuItem> )
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

export default FormDialog;