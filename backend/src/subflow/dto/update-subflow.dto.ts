import { PartialType } from '@nestjs/mapped-types';
import { CreateSubflowDto } from './create-subflow.dto';

export class UpdateSubflowDto extends PartialType(CreateSubflowDto) {}
