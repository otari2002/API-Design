import { PartialType } from '@nestjs/mapped-types';
import { CreateSubFlowDto } from './create-subflow.dto';

export class UpdateSubFlowDto extends PartialType(CreateSubFlowDto) {}
