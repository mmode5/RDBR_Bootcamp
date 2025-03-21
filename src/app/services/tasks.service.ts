import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { CreateTask, Task, TaskComment } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://momentum.redberryinternship.ge/api/tasks';
  private token = '9e70f307-c814-40be-bfaa-cb2f70efe511';

  private httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${this.token}`,
    }),
  };

  tasks = signal<Task[]>([]);

  constructor(private http: HttpClient) {}

  fetchTasks(): void {
    this.http
      .get<Task[]>(this.apiUrl, this.httpOptions)
      .pipe(
        catchError((error) => {
          console.error('❌ Error fetching tasks:', error);
          return of([]);
        })
      )
      .subscribe((data) => this.tasks.set(data));
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      catchError((error) => {
        console.error(`❌ Error fetching task ${id}:`, error);
        return of(null as unknown as Task);
      })
    );
  }

  getComments(taskId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/${taskId}/comments`, this.httpOptions)
      .pipe(
        catchError((error) => {
          console.error(
            `❌ Error fetching comments for task ${taskId}:`,
            error
          );
          return of([]);
        })
      );
  }

  createComment(
    taskId: number,
    text: string,
    parentId?: number
  ): Observable<TaskComment> {
    const requestBody = { text, task_id: taskId, parent_id: parentId || null };

    return this.http
      .post<TaskComment>(
        `${this.apiUrl}/${taskId}/comments`,
        requestBody,
        this.httpOptions
      )
      .pipe(
        catchError((error) => {
          console.error('❌ Error creating comment:', error);
          return of(null as unknown as TaskComment);
        })
      );
  }

  createTask(task: CreateTask): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, this.httpOptions).pipe(
      catchError((error) => {
        console.error('❌ Error creating task:', error);
        return of(null as unknown as Task);
      })
    );
  }

  updateTask(id: number, updateData: { status_id: number }): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiUrl}/${id}`, updateData, this.httpOptions)
      .pipe(
        catchError((error) => {
          console.error(`❌ Error updating task ${id}:`, error);
          return throwError(() => new Error(`Failed to update task ${id}`));
        })
      );
  }
}
