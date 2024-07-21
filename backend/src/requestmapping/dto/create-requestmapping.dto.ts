import { SourceType } from '@prisma/client';

export class CreateRequestMappingDto {
  apigee?: string;
  backend?: string;
  type: SourceType;
  flowId?: number;
  subFlowId?: number;
}
