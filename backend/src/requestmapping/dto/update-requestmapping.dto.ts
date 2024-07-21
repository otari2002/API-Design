import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestmappingDto } from './create-requestmapping.dto';

export class UpdateRequestmappingDto extends PartialType(CreateRequestmappingDto) {}
