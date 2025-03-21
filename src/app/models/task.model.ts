import { Employee, General, Priority } from './general.model';

export interface Task {
  id?: number;
  name: string;
  description: string;
  due_date: string;
  department: General;
  employee: Employee;
  status: General;
  priority: Priority;
  total_comments?: number;
}

export interface CreateTask {
  name: string;
  description: string;
  due_date: string;
  status_id: number;
  priority_id: number;
  department_id: number;
  employee_id: number;
}

export interface TaskComment {
  id: number;
  text: string;
  task_id: number;
  parent_id: number | null;
  author_avatar: string;
  author_nickname: string;
  sub_comments: TaskComment[];
}
