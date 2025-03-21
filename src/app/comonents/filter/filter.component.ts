import {
  Component,
  effect,
  inject,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Store } from '@ngrx/store';
import { Dropdown } from '../../models/general.model';
import { GeneralDataService } from '../../services/general-data.service';
import { setFilters, clearFilters } from '../../store/filter.action';
import { selectAllFilters } from '../../store/filter.selection';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FilterComponent implements OnInit {
  private generalDataService = inject(GeneralDataService);
  private store = inject(Store);

  @Output() filtersChanged = new EventEmitter<{ [key: string]: any[] }>();
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  departments = this.generalDataService.departments;
  priorities = this.generalDataService.priorities;
  employees = this.generalDataService.employees;

  dropdowns: Dropdown[] = [
    {
      label: 'დეპარტამენტი',
      key: 'departments',
      options: [],
      selected: [],
      tempSelected: [],
    },
    {
      label: 'პრიორიტეტი',
      key: 'priority',
      options: [],
      selected: [],
      tempSelected: [],
    },
    {
      label: 'თანამშრომლები',
      key: 'employees',
      options: [],
      selected: [],
      tempSelected: [],
    },
  ];

  openDropdown: number | null = null;
  ngOnInit() {
    this.store.select(selectAllFilters).subscribe((filters) => {
      this.dropdowns.forEach((dropdown) => {
        dropdown.selected = filters[dropdown.key] || [];
      });
      this.filtersChanged.emit(filters);
    });
  }
  constructor() {
    effect(() => {
      const dropdownMap = {
        departments: this.departments().map((dept) => ({
          id: dept.id,
          name: dept.name,
        })),
        priority: this.priorities().map((prio) => ({
          id: prio.id,
          name: prio.name,
        })),
        employees: this.employees().map((emp) => ({
          id: emp.id,
          name: emp.name,
          surname: emp.surname,
        })),
      };

      this.dropdowns.forEach((dropdown) => {
        if (dropdownMap[dropdown.key as keyof typeof dropdownMap]) {
          dropdown.options =
            dropdownMap[dropdown.key as keyof typeof dropdownMap];
        }
      });
    });
  }

  toggleDropdown(index: number) {
    this.openDropdown = this.openDropdown === index ? null : index;
    this.copySelections(index);
  }

  copySelections(index: number) {
    this.dropdowns[index].tempSelected = [...this.dropdowns[index].selected];
  }

  isSelected(item: { id: number; name: string }, index: number): boolean {
    return this.dropdowns[index].tempSelected.some((i) => i.id === item.id);
  }

  toggleSelection(item: { id: number; name: string }, index: number) {
    if (index === 2) {
      this.dropdowns[index].tempSelected = [item];
    } else {
      const tempSelected = this.dropdowns[index].tempSelected;
      const exists = tempSelected.find((i) => i.id === item.id);

      if (exists) {
        this.dropdowns[index].tempSelected = tempSelected.filter(
          (i) => i.id !== item.id
        );
      } else {
        tempSelected.push(item);
      }
    }
  }

  applySelection(index: number) {
    this.dropdowns[index].selected = [...this.dropdowns[index].tempSelected];
    this.openDropdown = null;
    this.store.dispatch(setFilters({ filters: this.getFiltersState() }));
  }

  removeItem(item: { id: number; name: string }, index: number) {
    this.dropdowns[index].selected = this.dropdowns[index].selected.filter(
      (i) => i.id !== item.id
    );
    this.store.dispatch(setFilters({ filters: this.getFiltersState() }));
  }

  hasSelectedItems(): boolean {
    return this.dropdowns.some((dropdown) => dropdown.selected.length > 0);
  }

  clearAll() {
    this.dropdowns.forEach((dropdown) => (dropdown.selected = []));
    this.store.dispatch(clearFilters());
  }

  getFiltersState(): { [key: string]: any[] } {
    const selectedFilters: { [key: string]: any[] } = {};
    this.dropdowns.forEach((dropdown) => {
      selectedFilters[dropdown.key] = dropdown.selected;
    });
    return selectedFilters;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownIfClickedOutside(event: Event): void {
    if (
      this.openDropdown !== null &&
      this.dropdownContainer &&
      !this.dropdownContainer.nativeElement.contains(event.target)
    ) {
      this.openDropdown = null;
    }
  }
}
