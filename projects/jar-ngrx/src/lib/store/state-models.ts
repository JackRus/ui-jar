import { EntityState } from '@ngrx/entity';
import { IFormatConverter } from '../converters/shared-models';

// REPRESENTS STRUCTURE OF THE MAIN/APP STATE
export interface AppState
{ 
    [name: string] : ModelState;
}

// REPRESENTS STATE FOR EACH ENTITY/MODEL
export interface ModelState<T = any> extends EntityState<T>
{    
    // COLLECTION OF ERRORS FOR THIS ENTITY
    errors: string[];   

    // NUMBER OF PENDING HTTP REQUESTS FOR THIS ENTITY
    pendingRequests: number;
    pendingCancellableRequest: boolean;

    // ID OF THE CURRENTLY SELECTED ENTITY
    selectedId: string | number;
}

export interface JarNgrxConfig {    
    deafaultConverter?: IFormatConverter[];    
    logLevel: JarNgrxLogLevel  
}

export enum JarNgrxLogLevel {
    None,    
    Minimum,
    Actions,
    Effects,
    ActionsAndEffects,
    Maximum   
} 