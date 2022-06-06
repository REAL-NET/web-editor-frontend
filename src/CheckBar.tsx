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
        description: "Positional operators must have readers"
    },
    {
        code: 3,
        description: "Tuple operators must not have readers"
    },
    {
        code: 4,
        description: "Leaves must be DataSource operators"
    },
    {
        code: 5,
        description: "Join operators must have at least two readers"
    },
    {
        code: 6,
        description: "Last operator must be tuple"
    },
    {
        code: 7,
        description: "Tuple operators must have tuple children"
    },
    {
        code: 8,
        description: "Positional operators must have positional children"
    },
    {
        code: 9,
        description: "Materializing operators must have positional children"
    },
    {
        code: 10,
        description: "Materializing operators must have tuple parent"
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