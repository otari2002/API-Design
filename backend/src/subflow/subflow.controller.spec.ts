import { Test, TestingModule } from '@nestjs/testing';
import { SubflowController } from './subflow.controller';
import { SubFlowService } from './subflow.service';

describe('SubflowController', () => {
  let controller: SubflowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubflowController],
      providers: [SubFlowService],
    }).compile();

    controller = module.get<SubflowController>(SubflowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
