export interface Attribute {
    name: string,
    kind: number,
    isInstantiable: boolean,
    type: {
        id: number,
        name: string
    },
    stringValue: string,
    referenceValue: {
        id: number,
        name: string
    }
}