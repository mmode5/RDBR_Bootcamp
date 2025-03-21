import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GetColorService {
  constructor() {}
  getStatusColor(id: number): string {
    const colorMap: { [key: number]: string } = {
      1: '#f7bc30',
      2: '#FB5607',
      3: '#FF006E',
      4: '#3A86FF',
    };
    return colorMap[id] || 'gray';
  }

  getPriorityColor(id: number): string {
    const colorMap: { [key: number]: string } = {
      1: '#08A508',
      2: '#FFBE0B',
      3: '#FA4D4D',
    };
    return colorMap[id] || 'gray';
  }

  getDepartmentColor(id: number): string {
    const colorMap: { [key: number]: string } = {
      1: '#FF66A8', // Dis
      2: '#FD9A6A', // Marketing
      3: '#89B6FF', // Logistics
      4: '#FFD86D', // IT
    };
    return colorMap[id] || 'gray';
  }
}
