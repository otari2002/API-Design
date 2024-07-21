import { Test, TestingModule } from '@nestjs/testing';
import { SubflowusageService } from './subflowusage.service';

describe('SubflowusageService', () => {
  let service: SubflowusageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubflowusageService],
    }).compile();

    service = module.get<SubflowusageService>(SubflowusageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
