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
    const [currentErrors, setCurrentErrors] = useState<{ code: number, description: string }[]>([]);
    const [className, setClassName] = useState<string>('hidden');

    useEffect(() => {
        if (props.checkErrorInfo.length === 0) {
            setCurrentErrors([])
            setClassName('hidden');
        } else {
            props.checkErrorInfo.forEach(errorCode => {
                const currentError = errors.find((error) => error.code === errorCode);
                if (currentError !== undefined && currentErrors.find(error => error.code === currentError.code) === undefined) {
                    setCurrentErrors(currentErrors.concat(currentError));
                    setClassName('alert');
                }
            });
        }
    }, [props.checkErrorInfo]);

    const errorsList = currentErrors.map(error => {
        return (<div key={error.code}>{error.description}</div>)
    });

    return (
        <div className={className}>
            <Alert variant="filled" severity="error">
                {errorsList}
            </Alert>
        </div>
    );
};

export default CheckBar;