import { createReducer, on } from '@ngrx/store';
import { setFilters, clearFilters } from './filter.action';

export interface FilterState {
  [key: string]: any[];
}

export const initialState: FilterState = JSON.parse(
  localStorage.getItem('filters') || '{}'
);

export const filterReducer = createReducer(
  initialState,
  on(setFilters, (state, { filters }) => {
    const newState = { ...state, ...filters };
    localStorage.setItem('filters', JSON.stringify(newState));
    return newState;
  }),
  on(clearFilters, () => {
    localStorage.removeItem('filters');
    return {};
  })
);
