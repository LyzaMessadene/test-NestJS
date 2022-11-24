import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { ModuleMocker } from 'jest-mock';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';

const mockService = new ModuleMocker(global);

const mockUser: User = {
  username: 'LyzaMess',
  id: 'aeac726c-e5cb-4f95-8c18-2dbf6248dcca',
  password: 'LyzaMess@15',
  tasks: [] as Task[],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn().mockResolvedValue(mockService),
            save: jest.fn().mockResolvedValue(mockService),
          },
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', async () => {
    expect(tasksService).toBeDefined();

    tasksRepository.create.mockResolvedValue('someTask');
    expect(tasksRepository.create).not.toBeCalled();

    const createdTask = {
      title: 'tâche test',
      description: 'description de tâche test',
    };

    const result = await tasksService.createTask(createdTask, mockUser);
    expect(tasksRepository.create).toHaveBeenCalledWith({
      title: 'tâche test',
      description: 'description de tâche test',
      status: TaskStatus.OPEN,
      user: mockUser,
    });
    expect(result).toEqual('someTask');
  });
});
