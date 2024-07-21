import { Test, TestingModule } from '@nestjs/testing';
import { SuboutputService } from './suboutput.service';

describe('SuboutputService', () => {
  let service: SuboutputService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuboutputService],
    }).compile();

    service = module.get<SuboutputService>(SuboutputService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
