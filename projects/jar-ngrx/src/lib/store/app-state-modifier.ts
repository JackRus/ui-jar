import { createEntityAdapter } from '@ngrx/entity';
import { AppState, ModelState } from './state-models';

// SIMPLIFIES MODEL STATE CHANGES/MODIFICATIONS
export const modelStateAdapter = createEntityAdapter<any>({
    //DEFAULT SORTING IS BY IDS
    //sortComparer: (e1: any, e2: any) => e1.order - e2.order  
});

// SELECTORS
export const { selectAll, selectEntities, selectTotal, selectIds } = modelStateAdapter.getSelectors();
export const selectedId = (state: ModelState) => state.selectedId;
export const selectErrors = (state: ModelState) => state.errors;
export const selectLoading = (state: ModelState) => state.pendingRequests > 0;
export const selectCancellableLoading = (state: ModelState) => state.pendingCancellableRequest;



export class AppStateModifier {   
    
    ///////////////////////////////
    ///// APP STATE MODIFIERS /////
    ///////////////////////////////
   
    /** RETURNS INITIAL APP STATE  */ 
    get initialState() : AppState { return {} }
    
    /** ADDS MODEL STATE TO APP STATE */
    addModelState(name: string, appState: AppState): AppState
    {        
        if (appState[name]) return appState;
        
        // COPY INSTANCE
        let copy = { ...appState };
       
        // ADD MODEL STATE
        copy[name] = modelStateAdapter.getInitialState({
            errors: [] as string[],
            pendingRequests: 0,
            pendingCancellableRequest: false,
            selectedId: null
        });

        // RETURN MODIFIED APP STATE
        return copy;
    }
   
    removeModelState(name: string, appState: AppState) : AppState
    {   
        //     
        if (!appState[name]) return appState;
        
        //
        let copy = { ...appState }; 

        // REMOVE MODEL STATE FROM APP STATE
        copy[name] = undefined;

        // RETURN MODIFIED APP STATE
        return copy;
    }
   
    resetAppState() : AppState { return this.initialState }


    //////////////////////////////////////
    /// SPECIFIC MODEL STATE MODIFIERS ///
    //////////////////////////////////////
   
    addOne(entity: any, modelStateName: string, appState: AppState): AppState {
        const modifier = (modelState) => modelStateAdapter.addOne(entity, modelState);
        return this.applyModifier(modifier, modelStateName, appState);
    }       

    addMany (entities: any[], modelStateName: string, appState: AppState) : AppState {
        const modifier = (modelState) => modelStateAdapter.addMany(entities, modelState);
        return this.applyModifier(modifier, modelStateName, appState);
    }        

    replaceAll (entities: any[], modelStateName: string, appState: AppState) : AppState {
        const modifier = (modelState)=> modelStateAdapter.addAll(entities, modelState);
        return this.applyModifier(modifier, modelStateName, appState);
    }
    
    removeOne (id: string, modelStateName: string, appState: AppState) : AppState {
        const modifier = (modelState) => modelStateAdapter.removeOne(id, modelState);
        return this.applyModifier(modifier, modelStateName, appState);
    } 

    removeMany(ids: string[], modelStateName: string, appState: AppState) : AppState
    {
        const modifier = (modelState) => modelStateAdapter.removeMany(ids, modelState);
        return this.applyModifier(modifier , modelStateName, appState);
    }
   
    removeAll(modelStateName: string, appState: AppState) : AppState
    {
        const modifier = (modelState) => modelStateAdapter.removeAll(modelState);
        return this.applyModifier(modifier, modelStateName, appState);
    }

    updateOne(entity: any, modelStateName: string, appState: AppState) : AppState
    {
        if (!entity || !entity.id) return appState;       
        const modifier = (modelState) => modelStateAdapter.updateOne({ id: entity.id, changes: entity }, modelState);
        return this.applyModifier(modifier, modelStateName, appState);
    }

    updateMany(entities: any[], modelStateName: string, appState: AppState) : AppState
    {
        let entitiesToModify = entities.map(e => ({id: e.id, changes: e}));
        const modifier = (modelState) => modelStateAdapter.updateMany(entitiesToModify, modelState);
        return this.applyModifier(modifier, modelStateName, appState);
    }
    
    upsertOne(entity: any, modelStateName: string, appState: AppState) : AppState
    {
        if (!entity || !entity.id) return appState; 
        const modifier = (modelState) => modelStateAdapter.upsertOne(entity, modelState);
        return this.applyModifier(modifier, modelStateName, appState);
    }

    upsertMany(entities: any[], modelStateName: string, state: AppState)
    {
        const modifier = (modelState) => modelStateAdapter.upsertMany(entities, modelState);
        return this.applyModifier(modifier, modelStateName, state);
    }

    assignSelectedId(selectedId: number | string, modelStateName: string, state: AppState)
    {
        const modifier = (modelState) => ({ ...modelState, selectedId: selectedId });
        return this.applyModifier(modifier, modelStateName, state);
    }

    private applyModifier(func: (entityState: ModelState) => ModelState, modelStatemodelStateName: string, appState: AppState)
    {
        let entityState = appState[modelStatemodelStateName];
        if (!entityState) return appState;
 
        entityState = func(entityState);
          
        let copy = { ...appState };
        copy[modelStatemodelStateName] = entityState;
        return copy;
    }
}