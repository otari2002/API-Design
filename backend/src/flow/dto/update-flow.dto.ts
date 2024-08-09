import { ApigeeInstance, SourceType, ValueType } from '@prisma/client';

export class UpdateFlowDto {
    infoflow: UpdateInfoFlowDTO;
    inputs?: Record<'BODY' | 'HEADER' | 'QUERY', Array<UpdateInputDto>>;
    outputs?: Record<'BODY' | 'HEADER', Array<UpdateOutputDto>>;
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
    mapping: string;
    source: SourceType;
    validation: string;
    origin: string;
    subOutputSource: SourceType | null;
    children?: Array<UpdateOutputDto>;
}