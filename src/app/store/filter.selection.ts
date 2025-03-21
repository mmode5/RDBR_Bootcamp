import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FilterState } from './filter.reducer';

export const selectFilterState = createFeatureSelector<FilterState>('filters');

export const selectAllFilters = createSelector(
  selectFilterState,
  (state) => state
);

export const selectFilterByKey = (key: string) =>
  createSelector(selectFilterState, (state) => state[key] || []);
