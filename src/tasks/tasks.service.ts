import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { createTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public getTasksWithFilter(filter: GetTasksFilterDto): Task[] {
    const { status, search } = filter;
    let tasks = this.getAllTasks();

    if (status) {
      console.log('status!');
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

  public getTaskById(taskId: string): Task {
    return this.tasks.find((task) => task.id === taskId);
  }

  public createTask(createTaskDto: createTaskDto): Task {
    const task: Task = {
      id: uuid(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  public deleteTask(taskId: string): Task {
    const deletedTask = this.tasks.find((task) => task.id === taskId);

    this.tasks = this.tasks.filter((task) => task.id != taskId);

    return deletedTask;
  }

  public updateTaskStatus(taskId: string, status: TaskStatus) {
    const updatedTask = this.getTaskById(taskId);

    updatedTask.status = status;

    return updatedTask;
  }
}
