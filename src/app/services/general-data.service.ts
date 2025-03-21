import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, forkJoin, throwError } from 'rxjs';
import { Employee, General, Priority } from '../models/general.model';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataService {
  private readonly baseUrl = 'https://momentum.redberryinternship.ge/api';
  private readonly authToken = '9e70f307-c814-40be-bfaa-cb2f70efe511'; // 🔑 Auth Token stored as a string value

  private readonly endpoints = {
    departments: `${this.baseUrl}/departments`,
    priorities: `${this.baseUrl}/priorities`,
    statuses: `${this.baseUrl}/statuses`,
    employees: `${this.baseUrl}/employees`,
  };

  departments = signal<General[]>([]);
  priorities = signal<Priority[]>([]);
  statuses = signal<General[]>([]);
  employees = signal<Employee[]>([]);

  constructor(private http: HttpClient) {
    this.loadGeneralData();
    this.loadEmployees();
  }

  private loadGeneralData(): void {
    forkJoin({
      departments: this.http.get<General[]>(this.endpoints.departments),
      priorities: this.http.get<Priority[]>(this.endpoints.priorities),
      statuses: this.http.get<General[]>(this.endpoints.statuses),
    })
      .pipe(
        catchError((error) => {
          console.error('❌ Error loading general data:', error);
          return throwError(() => error);
        })
      )
      .subscribe(({ departments, priorities, statuses }) => {
        this.departments.set(departments);
        this.priorities.set(priorities);
        this.statuses.set(statuses);
        console.log('✅ General data loaded successfully');
      });
  }

  loadEmployees(): void {
    if (!this.authToken) {
      console.error('❌ No authentication token found!');
      return;
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );

    this.http
      .get<Employee[]>(this.endpoints.employees, { headers })
      .pipe(
        catchError((error) => {
          console.error('❌ Error fetching employees:', error);
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        this.employees.set(data);
        console.log('✅ Fetched Employees:', data);
      });
  }
}
