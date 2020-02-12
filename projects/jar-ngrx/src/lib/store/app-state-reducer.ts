import { AppState } from './state-models';
import { AppStateModifier } from './app-state-modifier';
import { AppActions, AppActionTypes } from '../actions/app-state-actions';
import { ApiActions, ApiActionTypes, MakeRequest } from '../actions/api-actions';

const appStateAdapter = new AppStateModifier()

export function appStateReducer(appState = appStateAdapter.initialState, action: AppActions | ApiActions): AppState {

    let newState = { ...appState };
    let modelState = newState[action.modelStateName];    
    
    switch(action.baseType) {

        // LOADING CONTROL
        case ApiActionTypes.MakeRequest:
            modelState.pendingRequests++;
            return newState;
        
        case ApiActionTypes.RequestSuccess:
            modelState.pendingRequests--;
            return newState; 

        case ApiActionTypes.RequestError:
            modelState.pendingRequests--;
            modelState.errors = action.payload;
            return newState;

        case ApiActionTypes.MakeCancellableRequest:
            modelState.pendingCancellableRequest = true;
            return newState;

        case ApiActionTypes.CancellableRequestSuccess:
            modelState.pendingCancellableRequest = false;
            return newState; 

        case ApiActionTypes.CancellableRequestError:
            modelState.pendingCancellableRequest = false;
            modelState.errors = action.payload;
            return newState; 

        // APP STATE ACTIONS
        case AppActionTypes.AddModelState: return appStateAdapter.addModelState(action.modelStateName, appState);
        case AppActionTypes.RemoveModelState: return appStateAdapter.removeModelState(action.modelStateName, appState);
        case AppActionTypes.ResetAppState: return appStateAdapter.resetAppState();        

        // MODEL STATE ACTIONS 
        case AppActionTypes.AddOne: return appStateAdapter.addOne(action.payload, action.modelStateName, appState);
        case AppActionTypes.AddMany: return appStateAdapter.addMany(action.payload, action.modelStateName, appState);

        case AppActionTypes.ReplaceAll: return appStateAdapter.replaceAll(action.payload, action.modelStateName, appState);        
        case AppActionTypes.RemoveOne: return appStateAdapter.removeOne(action.payload, action.modelStateName, appState);
        case AppActionTypes.RemoveMany: return appStateAdapter.removeMany(action.payload, action.modelStateName, appState);
        case AppActionTypes.RemoveAll: return appStateAdapter.removeAll(action.modelStateName, appState);

        case AppActionTypes.UpdateOne: return appStateAdapter.updateOne(action.payload, action.modelStateName, appState);
        case AppActionTypes.UpdateMany: return appStateAdapter.updateMany(action.payload, action.modelStateName, appState);

        case AppActionTypes.UpsertOne: return appStateAdapter.upsertOne(action.payload, action.modelStateName, appState);
        case AppActionTypes.UpsertMany: return appStateAdapter.upsertMany(action.payload, action.modelStateName, appState);

        case AppActionTypes.SelectNewId: return appStateAdapter.assignSelectedId(action.payload, action.modelStateName, appState);
        default: return appState;
    }    
}