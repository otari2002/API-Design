import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestMappingDto } from './create-requestmapping.dto';

export class UpdateRequestMappingDto extends PartialType(CreateRequestMappingDto) {}
