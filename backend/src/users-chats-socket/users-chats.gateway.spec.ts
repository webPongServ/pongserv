import { Test, TestingModule } from '@nestjs/testing';
import { UsersChatsGateway } from './users-chats.gateway';

describe('UsersChatsGateway', () => {
  let gateway: UsersChatsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersChatsGateway],
    }).compile();

    gateway = module.get<UsersChatsGateway>(UsersChatsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
