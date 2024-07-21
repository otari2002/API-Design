import { PartialType } from '@nestjs/mapped-types';
import { CreateSubflowusageDto } from './create-subflowusage.dto';

export class UpdateSubflowusageDto extends PartialType(CreateSubflowusageDto) {}
