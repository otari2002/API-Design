import { PartialType } from '@nestjs/mapped-types';
import { CreateSubFlowUsageDto } from './create-subflowusage.dto';

export class UpdateSubFlowUsageDto extends PartialType(CreateSubFlowUsageDto) {}
