import { Test, TestingModule } from '@nestjs/testing';
import { SubFlowService } from './subflow.service';

describe('SubFlowService', () => {
  let service: SubFlowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubFlowService],
    }).compile();

    service = module.get<SubFlowService>(SubFlowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
