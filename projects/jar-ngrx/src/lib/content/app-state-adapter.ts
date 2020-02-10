import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AppState } from './state-models';

// SIMPLIFIES MODEL STATE CHANGES/MODIFICATIONS
export const modelStateAdapter: EntityAdapter<any> = createEntityAdapter<any>({
    //DEFAULT SORTING IS BY IDS
    //sortComparer: (e1: any, e2: any) => e1.order - e2.order  
});

// SELECTORS
export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal  
} = modelStateAdapter.getSelectors();    

export class AppStateAdapter {   
    /**
     * return the initial state of the collection of entities
     */ 
    get initialState() : AppState { return {} }
    
    addModelState(name: string, state: AppState): AppState
    {        
        if (state[name]) return state;
        
        // COPY INSTANCE
        let copy = { ...state };
       
        // ADD MODEL STATE
        copy[name] = modelStateAdapter.getInitialState({
            errors: [],
            pendingRequests: 0,
            selectedId: null
        });

        // RETURN MODIFIED APP STATE
        return copy;
    }

    /**
     * delete entity state from the MainState.
     * @param name the unique name of the entity to delete.
     * @param state the MainState.
     */
    deleteEntityState(name: string, state: AppState) : AppState
    {
        //if the entityState does not exist no change is needed.
        if(!state[name])
          return state;

        //create a shadow copy
        let copy = { ...state };  
        
        //set the entity state to undefine
        copy[name] = undefined;

        return copy;
    }

    /**
     * delete all the entity states for the MainState.
     * @param state the MainState.
     */
    deleteAllEntityStates(state: AppState) : AppState
    {
        return {};
    }


    //actions for specific entity state----------------------------------------------------------------------------------------------------------

    /**
     * Adds one item/entity to the specified entityStore
     * @param entity Entity to be addded
     * @param uniqueName Unique name of the entityState
     * @param state full State
     */
    entityStateAddOne(entity: any, uniqueName: string, state: AppState) : AppState
    {
       return this.processEntityState((es) => entityAdapter.addOne(entity, es), uniqueName, state);
    }

    /**
     * Adds collection of items/entities to the specified entityStore
     * @param entities Entities to be addded
     * @param uniqueName Unique name of the entityState
     * @param state full State
     */
    entityStateAddMany(entities: any[], uniqueName: string, state: AppState) : AppState
    {
        return this.processEntityState((es) => entityAdapter.addMany(entities, es), uniqueName, state);
    }

    /**
     * Replaces the all items in the specified entityStore with given collection
     * @param entities Entities to be addded
     * @param uniqueName Unique name of the entityState
     * @param state full State
     */
    entityStateAddAll(entities: any[], uniqueName: string, state: AppState) : AppState
    {
        return this.processEntityState((es)=> entityAdapter.addAll(entities, es), uniqueName, state);
    }

    /**
     * Removes one item/entity from the specified entityStore by id
     * @param id Id of the Entity to be removed
     * @param uniqueName Unique name of the entityState
     * @param state full State
     */
    entityStateRemoveOne(id: string, uniqueName: string, state: AppState) : AppState
    {
        return this.processEntityState((es)=> entityAdapter.removeOne(id, es), uniqueName, state);
    }   

    /**
     * Removes all items/entities from the specified entityStore matching the collection of ids
     * @param ids Collections of ids 
     * @param uniqueName Unique name of the entityState
     * @param state full State
     */
    entityStateRemoveMany(ids: string[], uniqueName: string, state: AppState) : AppState
    {
        return this.processEntityState((es) => entityAdapter.removeMany(ids, es), uniqueName, state);
    }

    /**
     * Removes all items/entities from the specified entityStore     
     * @param uniqueName Unique name of the entityState
     * @param state full State
     */
    entityStateRemoveAll(uniqueName: string, state: AppState) : AppState
    {
        return this.processEntityState((es) => entityAdapter.removeAll(es), uniqueName, state);
    }

    /**
     * Updates one item/entity in the specified entityStore
     * @param entity Entity to be updated
     * @param uniqueName Unique name of the entityState
     * @param state full State
    */
    entityStateUpdateOne(entity: any, uniqueName: string, state: AppState) : AppState
    {
        return this.processEntityState(
            (es)=> entityAdapter.updateOne({ id: entity.id, changes: entity }, es), 
            uniqueName, 
            state
        );
    }

    /**
     * Updates collection of item/entity in the specified entityStore
     * @param entities Entities to be updated
     * @param uniqueName Unique name of the entityState
     * @param state full State
    */
    entityStateUpdateMany(entities: any[], uniqueName: string, state: AppState) : AppState
    {
        return this.processEntityState(
            (es) => entityAdapter.updateMany(entities.map(e=> ({id: e.id, changes: e})), es), 
            uniqueName, 
            state
        );
    }

    /**
     * Updates or Adds (if doesn't exist) one item/entity in the specified entityStore
     * @param entity Entity to be updated/added
     * @param uniqueName Unique name of the entityState
     * @param state full State
    */  
    entityStateUpsertOne(entity: any, uniqueName: string, state: AppState) : AppState
    {
        return this.processEntityState((es)=> entityAdapter.upsertOne(entity, es), uniqueName, state);
    }

    entityStateUpsertMany(entities: any[], uniqueName: string, state: AppState)
    {
        return this.processEntityState((es)=> entityAdapter.upsertMany(entities, es), uniqueName, state);
    }

    selectEntityId(id: number | string, uniqueName: string, state: AppState)
    {
        return this.processEntityState((es) => ({ ...es, selectedId: id }), uniqueName, state);
    }

    /**
     * Modifies single entityState using the provided function and returns modified full State/Store
     * @param func Function to modify entityState
     * @param uniqueName Unique name of the entityState in the State/Store
     * @param state Full State/Store, which entityState is part of
     */
    private processEntityState(func: (entityState: ModelState) => ModelState, uniqueName: string, state: AppState)
    {
        let entityState = state[uniqueName];
        if (!entityAdapter) return state;
 
        entityState = func(entityState);
          
        let copy = {...state};
        copy[uniqueName] = entityState;
        return copy;
    }
}