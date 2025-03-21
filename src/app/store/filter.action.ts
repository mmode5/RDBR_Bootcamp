import { createAction, props } from '@ngrx/store';

export const setFilters = createAction(
  '[Filter] Set Filters',
  props<{ filters: { [key: string]: any[] } }>()
);

export const clearFilters = createAction('[Filter] Clear Filters');
