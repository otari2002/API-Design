import { Test, TestingModule } from '@nestjs/testing';
import { SubInputService } from './subinput.service';

describe('SubInputService', () => {
  let service: SubInputService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubInputService],
    }).compile();

    service = module.get<SubInputService>(SubInputService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
