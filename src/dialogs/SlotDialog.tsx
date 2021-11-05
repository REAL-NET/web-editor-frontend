import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {FormLabel, InputLabel, MenuItem, Select} from "@material-ui/core";
import {AddSlot, GetAttributes, GetValuesForAttribute} from "../requests/deepElementRequests";
import {Slot} from "../model/Slot";

type SlotDialogProps = {
    open: boolean,
    setOpen: Function,
    modelName: string,
    elementName: string,
    setSlots: Function
}

const SlotDialog: React.FC<SlotDialogProps> = ({open, setOpen, modelName, elementName, setSlots}) => {
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

    useEffect(() => {
        setValue(availableValues[0] || "");
        setIsNoError(availableValues.length > 0);
    }, [availableValues]);

    const [value, setValue] = useState("");
    const [isNoError, setIsNoError] = useState(true);

    const handleClose = () => {
        setAttributeName('');
        setValue(availableValues[0] || "");
        setOpen(false);
    };

    const handleAdd = async () => {
        console.log(modelName);
        console.log(elementName);
        const repoResp = await AddSlot(modelName, elementName, attributeName, modelName, value, level, potency);
        if (repoResp === undefined) {
            setIsNoError(false);
        } else {
            setSlots((slots: Slot[]) => slots.concat(repoResp));
            handleClose();
        }
    };

    const updateAttribute = async (newAttribute: string) => {
        setAttributeName(newAttribute);
        const values = await GetValuesForAttribute(modelName, elementName, newAttribute) || [];
        setAvailableValues(values.map(it => it.name));
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
                        onChange={async evt => await updateAttribute(`${evt.target.value}`)}
                        fullWidth={true}
                    >
                        {
                            availableAttributes.map(value => <MenuItem key={value + "_" + Math.round(Math.random() * 10000000).toString()}
                                                                       value={value}>{value}</MenuItem>)
                        }
                    </Select>
                    <InputLabel style={{marginTop: '0.5rem'}}>Value:</InputLabel>
                    <Select
                        value={value}
                        onChange={evt => setValue(evt.target.value as string)}
                        fullWidth={true}
                    >
                        {
                            availableValues.map(value => <MenuItem key={value + "_" + Math.round(Math.random() * 10000000).toString()}
                                                                   value={value}>{value}</MenuItem>)
                        }
                    </Select>
                    <br/>
                    <TextField
                        id="level"
                        label="Level:"
                        type="number"
                        value={level}
                        onChange={evt => setLevel(+evt.target.value)}
                        style={{marginTop: '0.5rem'}}
                    />
                    <TextField
                        id="potency"
                        label="Potency:"
                        type="number"
                        value={potency}
                        onChange={evt => setPotency(+evt.target.value)}
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

export default SlotDialog;