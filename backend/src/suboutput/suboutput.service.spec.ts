import { Test, TestingModule } from '@nestjs/testing';
import { SubOutputService } from './suboutput.service';

describe('SubOutputService', () => {
  let service: SubOutputService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubOutputService],
    }).compile();

    service = module.get<SubOutputService>(SubOutputService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
