import { ApigeeInstance, SourceType, ValueType } from '@prisma/client';

export class CreateFlowDto {
  name?: string;
  subject?: string;
  description?: string;
  proxyId: number;
  instanceApigee?: ApigeeInstance;
  domain: string;
  verb: string;
  path: string;
  inputs?: Record<'BODY' | 'HEADER' | 'QUERY', Array<InputDto>>;
  outputs?: Record<'BODY' | 'HEADER', Array<OutputDto>>;
  subflows?: Array<any>;
}

export class InputDto {
  name: string;
  source: SourceType;
  type: ValueType;
  validation: string;
  children?: Array<InputDto>;
}

export class OutputDto {
  name: string;
  mapping: string;
  source: SourceType;
  validation: string;
  origin: string;
  subOutputSource: SourceType | null;
  children?: Array<OutputDto>;
}