import { Test, TestingModule } from '@nestjs/testing';
import { SubFlowUsageService } from './subflowusage.service';

describe('SubFlowUsageService', () => {
  let service: SubFlowUsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubFlowUsageService],
    }).compile();

    service = module.get<SubFlowUsageService>(SubFlowUsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
