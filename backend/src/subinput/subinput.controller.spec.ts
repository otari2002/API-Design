import { Test, TestingModule } from '@nestjs/testing';
import { SubinputController } from './subinput.controller';
import { SubinputService } from './subinput.service';

describe('SubinputController', () => {
  let controller: SubinputController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubinputController],
      providers: [SubinputService],
    }).compile();

    controller = module.get<SubinputController>(SubinputController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
