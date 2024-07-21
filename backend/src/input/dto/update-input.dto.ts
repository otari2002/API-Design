import { PartialType } from '@nestjs/mapped-types';
import { CreateInputDto } from './create-input.dto';

export class UpdateInputDto extends PartialType(CreateInputDto) {}
