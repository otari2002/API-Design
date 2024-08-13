import { Proxy } from 'src/proxy/entities/proxy.entity';
import { ApigeeInstance, Input, Output, RequestMapping, SubFlowUsage } from '@prisma/client';

export class Flow {
  id: number;
  name: string;
  subject?: string;
  description?: string;
  proxyId: number;
  instanceApigee?: ApigeeInstance;
  domain: string;
  verb: string;
  path: string;
  Proxy?: Proxy;
  inputs?: Input[];
  outputs?: Output[];
  subFlowUsages?: SubFlowUsage[];
  requestMappings?: RequestMapping[];
}
