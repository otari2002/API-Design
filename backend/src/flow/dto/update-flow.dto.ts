import { ApigeeInstance, SourceType, ValueType } from '@prisma/client';

export class  UpdateFlowDto {
    infoflow: UpdateInfoFlowDTO;
    inputs?: Record<'BODY' | 'HEADER' | 'QUERY', Array<UpdateInputDto>>;
    outputs?: Record<'BODY' | 'HEADER', Array<UpdateOutputDto>>;
    subOutputs?: Record<'BODY' | 'HEADER', Array<UpdateOutputDto>>;
    subflows?: Array<any>;
}

export class UpdateInfoFlowDTO {
    name?: string;
    subject?: string;
    description?: string;
    proxyId: number;
    instanceApigee?: ApigeeInstance;
    domain: string;
    verb: string;
    path: string;
    backendId?: number;
}

export class UpdateInputDto {
    name: string;
    source: SourceType;
    type: ValueType;
    validation: string;
    children?: Array<UpdateInputDto>;
    inputId?: number;
}


export class UpdateOutputDto {
    outputId?: number;
    name: string;
    type: ValueType; 

    mapping: string;
    source: SourceType;
    validation: string;
    origin: string;
    subOutputSource: SourceType | null;
    parentId?: number;
    children?: Array<UpdateOutputDto>;
}
export class UpdateSubOutputDto {
    outputId?: number;
    // inputId?: number;
    name: string;
    type: ValueType;
    mapping: string;
    source: SourceType;
    validation: string;
    origin: string;
    subOutputSource: SourceType | null;
    children?: Array<UpdateOutputDto>;
    subOutputId: number;

}

