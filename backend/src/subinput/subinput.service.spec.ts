import { Test, TestingModule } from '@nestjs/testing';
import { SubinputService } from './subinput.service';

describe('SubinputService', () => {
  let service: SubinputService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubinputService],
    }).compile();

    service = module.get<SubinputService>(SubinputService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
