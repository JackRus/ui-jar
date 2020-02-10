import { AppState } from './state-models';
import { AppStateAdapter } from './app-state-adapter';

const appStateAdapter = new AppStateAdapter()

export function appStateReducer(state = appStateAdapter.initialState, action: StateAction): AppState {
    switch (action.type) {
        case CourseActionTypes.LESSON_LOADED:
             return adapter.addOne(action.payload.course, state);
        default: 
            return state;
    }
}