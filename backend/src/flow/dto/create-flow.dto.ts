import { ApigeeInstance } from '@prisma/client';

export class CreateFlowDto {
  name?: string;
  subject?: string;
  description?: string;
  proxyId: number;
  instanceApigee?: ApigeeInstance;
  domain?: string;
  verb?: string;
  path?: string;
}
