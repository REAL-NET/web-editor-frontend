export interface NodeParam {
    key: string,
    value: string
}
export interface PipelineNodeProps {
    id: string;
    blockType: string;
    children?: Array<string>;
    params?: Array<NodeParam>;
}