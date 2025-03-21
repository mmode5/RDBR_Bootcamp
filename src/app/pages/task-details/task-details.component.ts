import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskComment, Task } from '../../models/task.model';
import { GeneralDataService } from '../../services/general-data.service';
import { GetColorService } from '../../services/get-color.service';
import { TaskService } from '../../services/tasks.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../comonents/header/header.component';
import { GeorgianDatePipe } from '../../pipes/georgian-date.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, HeaderComponent, GeorgianDatePipe, FormsModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TaskDetailsComponent {
  private generalDataService = inject(GeneralDataService);
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private getColorService = inject(GetColorService);

  statuses = this.generalDataService.statuses;
  taskId = Number(this.route.snapshot.paramMap.get('id'));
  dropdownOpen: boolean = false;
  comments = signal<TaskComment[]>([]);
  newCommentText: string = '';
  replyingTo: number | null = null;
  replyText: string = '';

  task = signal<Task | null>(null);
  getTotalComments(): number {
    return this.comments().reduce(
      (total, comment) => total + 1 + (comment.sub_comments?.length || 0),
      0
    );
  }

  constructor() {
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe((data) => {
        this.task.set(data);
      });
    }

    this.taskService.getComments(this.taskId).subscribe((data) => {
      this.comments.set(data);
    });
  }

  getStatusColor(id: number): string {
    return this.getColorService.getStatusColor(id);
  }

  getPriorityColor(id: number): string {
    return this.getColorService.getPriorityColor(id);
  }

  getDepartmentColor(id: number): string {
    return this.getColorService.getDepartmentColor(id);
  }

  updateStatus(statusId: number) {
    if (!this.task()) return;

    const updatedTask = { status_id: statusId };

    console.log('🔄 Updating Task ${this.taskId} to Status ID:', statusId);

    this.taskService.updateTask(this.taskId, updatedTask).subscribe({
      next: (updatedTask) => {
        if (updatedTask) {
          console.log(`✅ Successfully updated task to Status ID ${statusId}`);

          const newStatus = this.statuses().find((s) => s.id === statusId);
          if (newStatus) {
            this.task.update((t) => ({
              ...t!,
              status: newStatus,
            }));
          }

          this.dropdownOpen = false;
        }
      },
      error: (error) => {
        console.error(`❌ Failed to update task ${this.taskId}:`, error);
      },
    });
  }

  addComment() {
    if (!this.newCommentText.trim()) return;
    console.log(this.newCommentText);
    this.taskService
      .createComment(this.taskId, this.newCommentText)
      .subscribe((comment: TaskComment) => {
        if (comment) {
          this.comments.update((current) => [...current, comment]);
          this.newCommentText = '';
        } else {
          console.error('❌ API did not return a valid comment object');
        }
      });
  }
  onTextChange(event: any) {
    console.log('⌨️ Input changed:', event.target.value);
  }

  @ViewChild('dropdownOptions') dropdownOptions!: ElementRef;
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      setTimeout(() => {
        const parentWidth =
          this.dropdownOptions.nativeElement.parentElement.getBoundingClientRect()
            .width;
        this.dropdownOptions.nativeElement.style.width = '${parentWidth}px';
      }, 10);
    }
  }
  toggleReply(commentId: number) {
    this.replyingTo = this.replyingTo === commentId ? null : commentId;
    this.replyText = '';
  }

  submitReply(commentId: number) {
    if (!this.replyText.trim()) return;

    this.taskService
      .createComment(this.taskId, this.replyText, commentId)
      .subscribe((newComment: TaskComment) => {
        if (newComment) {
          this.comments.update((currentComments) =>
            currentComments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  sub_comments: [...(comment.sub_comments || []), newComment],
                };
              }
              return comment;
            })
          );
        }

        this.replyText = '';
        this.replyingTo = null;
      });
  }

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
  @HostListener('document:click', ['$event'])
  closeDropdownIfClickedOutside(event: Event) {
    if (
      this.dropdownOpen &&
      this.dropdownContainer &&
      !this.dropdownContainer.nativeElement.contains(event.target)
    ) {
      this.dropdownOpen = false;
    }
  }
}
