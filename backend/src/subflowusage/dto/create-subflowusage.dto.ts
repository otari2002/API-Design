export class CreateSubFlowUsageDto {
    flowId: number;
    subFlowId: number;
    isConditionnal: boolean;
    condition?: string;
    order: number;
  }
  