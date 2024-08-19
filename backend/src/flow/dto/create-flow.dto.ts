import { ApigeeInstance, SourceType, ValueType } from '@prisma/client';

export class CreateFlowDto {
  infoflow: InfoFlowDTO;
  inputs?: Record<'BODY' | 'HEADER' | 'QUERY', Array<InputDto>>;
  outputs?: Record<'BODY' | 'HEADER', Array<OutputDto>>;
  subflows?: Array<any>;
}

export class InfoFlowDTO {
  name?: string;
  subject?: string;
  description?: string;
  backendId?: number;
  proxyId: number;
  instanceApigee?: ApigeeInstance;
  domain: string;
  verb: string;
  path: string;
}

export class InputDto {
  name: string;
  source: SourceType;
  type: ValueType;
  validation: string;
  children?: Array<InputDto>;
}


export class OutputDto {
  outputId?: number;
  // subOutputId: number;
  // inputId: number;
  name: string;
  mapping: string;
  source: SourceType;
  validation: string;
  type: ValueType;
  origin: string;
  subOutputSource: SourceType | null;
  children?: Array<OutputDto>;
}