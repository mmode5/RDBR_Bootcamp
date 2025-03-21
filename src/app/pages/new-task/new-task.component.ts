import {
  Component,
  inject,
  ChangeDetectorRef,
  computed,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { GeneralDataService } from '../../services/general-data.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TaskService } from '../../services/tasks.service';
import { CreateTask } from '../../models/task.model';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../comonents/header/header.component';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HeaderComponent],
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NewTaskComponent {
  private generalDataService = inject(GeneralDataService);

  minDate: string = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  statuses = this.generalDataService.statuses;
  priorities = this.generalDataService.priorities;
  departments = this.generalDataService.departments;
  employees = this.generalDataService.employees;

  openDropdown: string | null = null;
  taskForm: FormGroup;
  showEmployeeField: boolean = false;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ],
      ],
      description: ['', Validators.maxLength(255)],
      status: [null, Validators.required],
      priority: [null, Validators.required],
      employee: [null, Validators.required],
      department: [null, Validators.required],
      due_date: [this.minDate, Validators.required],
    });
  }
  @ViewChild('dateInput') dateInput!: ElementRef;

  ngAfterViewInit() {
    if (this.dateInput) {
      console.log(
        'Date input element initialized:',
        this.dateInput.nativeElement
      );
    }
  }
  openCalendar() {
    if (this.dateInput && this.dateInput.nativeElement) {
      this.dateInput.nativeElement.showPicker?.();
    }
  }

  updateDate(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedDate = inputElement.value;
    console.log('Selected Date:', selectedDate);

    if (selectedDate) {
      this.taskForm.get('due_date')?.setValue(selectedDate);

      console.log('Updated form due_date:', this.taskForm.value.due_date);
    }
  }
  onDepartmentChange() {
    const selectedDepartment = this.taskForm.get('department')?.value;
    if (selectedDepartment) {
      this.showEmployeeField = true;
      this.taskForm.get('employee')?.reset();
    } else {
      this.showEmployeeField = false;
    }
  }
  filteredEmployees() {
    const selectedDepartment = this.taskForm.get('department')?.value;
    return selectedDepartment
      ? this.employees().filter(
          (emp) => emp.department.id === selectedDepartment.id
        )
      : [];
  }
  ngOnInit() {
    const savedForm = sessionStorage.getItem('taskForm');
    if (savedForm) {
      this.taskForm.patchValue(JSON.parse(savedForm));
    }

    this.taskForm.valueChanges.subscribe(() => {
      sessionStorage.setItem('taskForm', JSON.stringify(this.taskForm.value));
    });
    setTimeout(() => {
      const availableStatuses = this.statuses();
      const availablePriorities = this.priorities();

      console.log('Statuses:', availableStatuses);
      console.log('Priorities:', availablePriorities);

      if (availableStatuses.length > 0) {
        this.taskForm.get('status')?.setValue(availableStatuses[0]);
      }
      if (availablePriorities.length > 0) {
        this.taskForm.get('priority')?.setValue(availablePriorities[0]);
      }
    }, 500);
    console.log(this.taskForm.get('department')?.value);
  }

  toggleDropdown(dropdownKey: string) {
    if (dropdownKey === 'employee' && !this.taskForm.get('department')?.value) {
      console.log('p');
      return;
    }
    this.openDropdown = this.openDropdown === dropdownKey ? null : dropdownKey;
  }

  isDropdownOpen(dropdownKey: string): boolean {
    return this.openDropdown === dropdownKey;
  }

  updateSelection(dropdownKey: string, id: number) {
    if (dropdownKey === 'status') {
      const selectedStatus = this.statuses().find((status) => status.id === id);
      if (selectedStatus) {
        this.taskForm.get('status')?.setValue(selectedStatus);
      }
    } else if (dropdownKey === 'priority') {
      const selectedPriority = this.priorities().find(
        (priority) => priority.id === id
      );
      if (selectedPriority) {
        this.taskForm.get('priority')?.setValue(selectedPriority);
      }
    } else if (dropdownKey === 'employee') {
      const selectedEmployee = this.employees().find(
        (employee) => employee.id === id
      );
      if (selectedEmployee) {
        this.taskForm.get('employee')?.setValue(selectedEmployee);
        console.log(this.taskForm.get('employee')?.value.name);
      }
    } else if (dropdownKey === 'department') {
      const selectedDepartment = this.departments().find(
        (department) => department.id === id
      );
      if (selectedDepartment) {
        this.taskForm.get('department')?.setValue(selectedDepartment);
        this.taskForm.get('employee')?.reset();
      }
    }

    this.openDropdown = null;
  }

  descriptionHasMinWords(): boolean {
    const description = this.taskForm.get('description')?.value || '';
    return (
      description.trim().split(/\s+/).length >= 4 ||
      description.trim().length === 0
    );
  }
  private taskService = inject(TaskService);
  private router = inject(Router);
  createTask() {
    if (this.taskForm.valid) {
      const newTask: CreateTask = {
        name: this.taskForm.value.title,
        description: this.taskForm.value.description,
        due_date: this.taskForm.value.due_date,
        status_id: this.taskForm.value.status?.id,
        priority_id: this.taskForm.value.priority?.id,
        department_id: this.taskForm.value.department?.id,
        employee_id: this.taskForm.value.employee?.id,
      };

      console.log('📤 Sending Task:', newTask);

      this.taskService.createTask(newTask).subscribe({
        next: (response) => {
          sessionStorage.removeItem('taskForm');
          this.taskForm.reset();
          this.router.navigate(['/landing']);
        },
        error: (error) => {
          console.error('⚠️ Task creation failed:', error);
        },
      });
    } else {
      alert('გთხოვთ შეავსოთ ყველა სავალდებულო ველი.');
    }
  }
}
