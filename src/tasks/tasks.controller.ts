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
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatus } from './dto/updateTaskStatus.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  @Get()
  getTasks(@Query() filter: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(filter);
  }

  @Get('/:taskId')
  getTaskById(@Param('taskId') taskId: string): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:taskId')
  deleteTask(@Param('taskId') taskId: string): Promise<Task> {
    return this.tasksService.deleteTask(taskId);
  }

  @Put(':taskId/status')
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() updateTaskStatus: UpdateTaskStatus,
  ): Promise<Task> {
    const { status } = updateTaskStatus;

    return this.tasksService.updateTaskStatus(taskId, status);
  }
}
