import { Test, TestingModule } from '@nestjs/testing';
import { SuboutputController } from './suboutput.controller';
import { SubOutputService } from './suboutput.service';

describe('SuboutputController', () => {
  let controller: SuboutputController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuboutputController],
      providers: [SubOutputService],
    }).compile();

    controller = module.get<SuboutputController>(SuboutputController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
