import { Test, TestingModule } from '@nestjs/testing';
import { RequestmappingService } from './requestmapping.service';

describe('RequestmappingService', () => {
  let service: RequestmappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestmappingService],
    }).compile();

    service = module.get<RequestmappingService>(RequestmappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
