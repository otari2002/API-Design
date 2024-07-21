import { Test, TestingModule } from '@nestjs/testing';
import { SubflowService } from './subflow.service';

describe('SubflowService', () => {
  let service: SubflowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubflowService],
    }).compile();

    service = module.get<SubflowService>(SubflowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
