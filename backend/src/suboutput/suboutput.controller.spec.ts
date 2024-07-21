import { Test, TestingModule } from '@nestjs/testing';
import { SuboutputController } from './suboutput.controller';
import { SuboutputService } from './suboutput.service';

describe('SuboutputController', () => {
  let controller: SuboutputController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuboutputController],
      providers: [SuboutputService],
    }).compile();

    controller = module.get<SuboutputController>(SuboutputController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
