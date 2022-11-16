import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { createTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  @Get()
  getTasks(@Query() filter: GetTasksFilterDto): Task[] {
    if (Object.keys(filter).length) {
      return this.tasksService.getTasksWithFilter(filter);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get('/:taskId')
  getTaskById(@Param('taskId') taskId: string): Task {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  createTask(@Body() createTaskDto: createTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:taskId')
  deleteTask(@Param('taskId') taskId: string): Task {
    return this.tasksService.deleteTask(taskId);
  }

  @Put(':taskId/status')
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body('status') status: TaskStatus,
  ) {
    return this.tasksService.updateTaskStatus(taskId, status);
  }
}
