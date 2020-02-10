import { createEntityAdapter, EntityState } from '@ngrx/entity';

// REPRESENTS STRUCTURE OF THE MAIN/APP STATE
export interface AppState
{ 
    [name: string] : ModelState;
}

// REPRESENTS STATE FOR EACH ENTITY/MODEL
export interface ModelState extends EntityState<any>
{    
    // COLLECTION OF ERRORS FOR THIS ENTITY
    errors: string[];   

    // NUMBER OF PENDING HTTP REQUESTS FOR THIS ENTITY
    pendingRequests: number;

    // ID OF THE CURRENTLY SELECTED ENTITY
    selectedId: string;
}