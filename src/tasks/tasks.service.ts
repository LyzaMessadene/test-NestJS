import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  public async getTasks(filter: GetTasksFilterDto): Promise<Task[]> {
    let tasks = await this.tasksRepository.find();
    if (!filter) return tasks;

    const { status, search } = filter;
    if (status) {
      tasks = tasks.filter((task) => task.status == status);
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search))
          return true;
        else return false;
      });
    }
    return tasks;
  }

  public async getTaskById(taskId: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id: taskId });

    if (!found) {
      throw new NotFoundException(`Task with ID: ${taskId} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;

    const createdTask = this.tasksRepository.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(createdTask);

    return createdTask;
  }

  public async deleteTask(taskId: string): Promise<Task> {
    const deletedTask = this.getTaskById(taskId);

    await this.tasksRepository.delete(taskId);

    return deletedTask;
  }

  public async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
  ): Promise<Task> {
    const updatedTask = await this.getTaskById(taskId);

    updatedTask.status = status;
    await this.tasksRepository.save(updatedTask);

    return updatedTask;
  }
}
