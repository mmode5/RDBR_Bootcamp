import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filters = signal<{ [key: string]: any[] }>({});

  setFilters(updatedFilters: { [key: string]: any[] }) {
    this.filters.set(updatedFilters);
  }
}
