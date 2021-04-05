import { ChangeEvent, FC, memo, } from 'react';
import { Handle, NodeProps, Position, } from 'react-flow-renderer';
import '../../index.css';
import type { PipelineNodeProps } from '../types';
import ParamsInput from './ParamsInput';

const PipelineNode: FC<NodeProps> = ({data} ) => {  
  const props = data as PipelineNodeProps;
  // const onChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   if (!props.params) return;
  //   props.params.filter(t => t.key === event.target.name).map(x => x.value = event.target.value);
  // }

  const customNodeStyles = {
    background: '#9CA8B3',
    color: '#FFF',
    padding: 10,
    'border-radius': '5px'
  };

  // const paramsRender = props.params ? <ul className='paramsNode'>{props.params.map(t => <ParamsInput onChange={onChange} key={t.key} value={t.value} />)}</ul> : '';
  return (
    <div style={customNodeStyles}>
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <div>
        <strong>{props.blockType}</strong>
        {/* {paramsRender} */}
      </div>
      <Handle type="source" position={Position.Right} id="a" style={{ background: '#555' }} />
    </div>
  );
};

export default memo(PipelineNode);
