export interface Node {
    id: number,
    name: string,
    class: {
        id: number,
        name: string
    },
    attributes: Attribute[],
    isAbstract: boolean,
    metatype: number,
    instanceMetatype: number,
    shape: string
}

export interface Edge {
    from: {
        id: number,
        name: string
    },
    to: {
        id: number,
        name: string
    },
    id: number,
    name: string,
    class: {
        id: number,
        name: string
    },
    attributes: Attribute[],
    isAbstract: boolean,
    metatype: number,
    instanceMetatype: number,
    shape: string
}

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