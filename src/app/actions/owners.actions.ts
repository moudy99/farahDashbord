import { createAction, props } from '@ngrx/store';
import { Owner } from './../Interfaces/owner';

export const selectOwner = createAction(
  '[Owner] Select Owner',
  props<{ owner: Owner }>()
);
