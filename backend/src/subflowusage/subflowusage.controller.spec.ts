import { Test, TestingModule } from '@nestjs/testing';
import { SubflowusageController } from './subflowusage.controller';
import { SubFlowUsageService } from './subflowusage.service';

describe('SubflowusageController', () => {
  let controller: SubflowusageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubflowusageController],
      providers: [SubFlowUsageService],
    }).compile();

    controller = module.get<SubflowusageController>(SubflowusageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
