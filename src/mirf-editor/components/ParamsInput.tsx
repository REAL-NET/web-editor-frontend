import { ChangeEvent, FC } from 'react';
import { NodeParam } from '../types';

interface IParamInput extends NodeParam {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
const ParamsInput: FC<IParamInput>  = ({onChange, key, value = ''}) => {
    return (
        <div>
        <div>{key}</div>
        <input
        name={ key }
        value={ value }
        onChange={ onChange }
      />
      </div>
    );
};

export default ParamsInput;