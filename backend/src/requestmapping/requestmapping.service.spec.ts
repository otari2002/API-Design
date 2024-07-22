import { Test, TestingModule } from '@nestjs/testing';
import { RequestMappingService } from './requestmapping.service';

describe('RequestMappingService', () => {
  let service: RequestMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestMappingService],
    }).compile();

    service = module.get<RequestMappingService>(RequestMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
