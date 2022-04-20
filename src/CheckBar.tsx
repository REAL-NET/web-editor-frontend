import React, {DragEvent, useEffect, useState} from 'react';

import Alert from '@mui/material/Alert';

import './CheckBar.css';

const errors = [
    {
        code: 1,
        description: "Type attribute is missing"
    },
    {
        code: 2,
        description: "Positional operator does not have any readers"
    },
    {
        code: 3,
        description: "Tuple operator have a reader"
    }
]

const CheckBar = (props: { checkErrorInfo: number[]} ) => {
    const [currentErrors, setCurrentErrors] = useState<Array<{ code: number, description: string }>>([]);
    const [className, setClassName] = useState<string>('hidden');

    useEffect(() => {
        if (props.checkErrorInfo.length === 0) {
            setCurrentErrors([])
            setClassName('hidden');
        } else {
            const newErrors: Array<{ code: number, description: string }> = [];
            props.checkErrorInfo.forEach(errorCode => {
                const newError = errors.find(error => error.code === errorCode);
                const description = newError !== undefined ? newError.description : 'Unknown error';
                newErrors.push({code: errorCode, description: description});
            });
            setCurrentErrors(newErrors);
            setClassName('alertContainer');
        }
    }, [props.checkErrorInfo]);

    const errorsList = currentErrors.map(error => {
        return (
            <Alert className="alert" key={error.code} variant="filled" severity="error">
                {error.description}
            </Alert>
        )
    });

    return (
        <div className={className}>
            {errorsList}
        </div>
    );
};

export default CheckBar;