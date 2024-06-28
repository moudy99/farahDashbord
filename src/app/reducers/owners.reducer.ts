import { createReducer, on } from '@ngrx/store';
import { Owner } from 'src/app/Interfaces/owner';
import * as OwnersActions from '../actions/owners.actions';

export interface OwnersState {
  selectedOwner: Owner | null;
}

export const initialState: OwnersState = {
  selectedOwner: null,
};

export const ownersReducer = createReducer(
  initialState,

  on(OwnersActions.selectOwner, (state, { owner }) => ({
    ...state,
    selectedOwner: owner,
  }))
);
