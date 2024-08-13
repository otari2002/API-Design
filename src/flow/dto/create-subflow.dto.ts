import { SourceType, ValueType } from "@prisma/client";

export  class SubFlowDto {
  id: number;
  name: string;
  backendId: number;
  backendPath: string;
  ssl: boolean;
  isConditional: boolean;
  condition: string | null;
  subOutputs?: {
    BODY: SubOutputDto[];
    HEADER: SubOutputDto[];
  };
  subInputs?: SubInputDto[];
  requestMappings?: {
    BODY: RequestMappingDto[];
    HEADER: RequestMappingDto[];
    QUERY: RequestMappingDto[];
  };
}
  
export  class SubOutputDto {
  subOutputId: number;
  id: number;
  name: string;
  source: SourceType;
  type: ValueType;
  subFlowId: number;
  parentId: number | null;
}

export  class SubInputDto {
  id: number;
  name: string;
  source: SourceType;
  type: ValueType;
  subFlowId: number;
}

export  class RequestMappingDto {
  backend: string;
  apigee: string;
  source: string;
  origin: string;
  subOutputSource: SourceType;
  inputId: number;
  type: ValueType;
  isEmpty?: boolean;
  parentId?: number;
}