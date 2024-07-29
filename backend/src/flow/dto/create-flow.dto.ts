import { ApigeeInstance } from '@prisma/client';

export class CreateFlowDto {
  name?: string;
  subject?: string;
  description?: string;
  proxyId: number;
  instanceApigee?: ApigeeInstance;
  domain: string;
  verb: string;
  path: string;
  inputs?: Record<'BODY' | 'HEADER' | 'QUERY', Array<any>>;
  outputs?: Record<'BODY' | 'HEADER', Array<any>>;
  subflows?: Array<any>;
}
