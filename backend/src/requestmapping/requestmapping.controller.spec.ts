import { Test, TestingModule } from '@nestjs/testing';
import { RequestmappingController } from './requestmapping.controller';
import { RequestMappingService } from './requestmapping.service';

describe('RequestmappingController', () => {
  let controller: RequestmappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestmappingController],
      providers: [RequestMappingService],
    }).compile();

    controller = module.get<RequestmappingController>(RequestmappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
