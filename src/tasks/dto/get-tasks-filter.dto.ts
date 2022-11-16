import { TaskStatus } from '../task.model';

export interface GetTasksFilterDto {
  status?: TaskStatus;
  search?: string;
}
