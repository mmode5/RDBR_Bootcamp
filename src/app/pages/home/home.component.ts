import {
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { HeaderComponent } from '../../comonents/header/header.component';
import { Router } from '@angular/router';
import { GeneralDataService } from '../../services/general-data.service';
import { TaskService } from '../../services/tasks.service';
import { FilterComponent } from '../../filter/filter.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeorgianDatePipe } from '../../pipes/georgian-date.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FilterComponent, CommonModule, GeorgianDatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent {
  private generalDataService = inject(GeneralDataService);
  private taskService = inject(TaskService);
  private router = inject(Router);

  statuses = this.generalDataService.statuses;
  tasks = this.taskService.tasks;

  selectedFilters: WritableSignal<{ [key: string]: any[] }> = signal({});

  constructor() {
    this.taskService.fetchTasks();
  }

  onFiltersChanged(filters: { [key: string]: any[] }) {
    this.selectedFilters.set({ ...filters });
  }

  filteredTasks = computed(() => {
    const filters = this.selectedFilters();
    let filteredTasks = this.tasks();

    if (
      filters['departments'] &&
      Array.isArray(filters['departments']) &&
      filters['departments'].length > 0
    ) {
      filteredTasks = filteredTasks.filter((task) =>
        filters['departments'].some((dept) => dept.id === task.department.id)
      );
    }

    if (
      filters['priority'] &&
      Array.isArray(filters['priority']) &&
      filters['priority'].length > 0
    ) {
      filteredTasks = filteredTasks.filter((task) =>
        filters['priority'].some((prio) => prio.id === task.priority.id)
      );
    }

    if (
      filters['employees'] &&
      Array.isArray(filters['employees']) &&
      filters['employees'].length > 0
    ) {
      filteredTasks = filteredTasks.filter((task) =>
        filters['employees'].some((emp) => emp.id === task.employee.id)
      );
    }

    return filteredTasks;
  });

  getTasksByStatus = computed(() => {
    return this.statuses().map((statusObj) => ({
      status: { id: statusObj.id, name: statusObj.name },
      tasks: this.filteredTasks().filter(
        (task) => task.status.name === statusObj.name
      ),
    }));
  });

  seeTaskDetails(taskId: number) {
    this.router.navigate(['/tasks', taskId]);
  }

  getStatusColor(id: number): string {
    const colorMap: { [key: number]: string } = {
      1: '#f7bc30',
      2: '#FB5607',
      3: '#FF006E',
      4: '#3A86FF',
    };
    return colorMap[id];
  }

  getPriorityColor(id: number): string {
    const colorMap: { [key: number]: string } = {
      1: '#08A508',
      2: '#FFBE0B',
      3: '#FA4D4D',
    };
    return colorMap[id];
  }

  getDepartmentColor(id: number): string {
    const colorMap: { [key: number]: string } = {
      1: '#FF66A8', //dis
      2: '#FD9A6A', //mark
      3: '#89B6FF', //log
      4: '#FFD86D', //it
    };
    return colorMap[id];
  }
}
