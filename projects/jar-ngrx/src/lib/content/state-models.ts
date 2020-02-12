import { createEntityAdapter, EntityState } from '@ngrx/entity';

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
    //deafaultRequestFormat: IFormatConverterFactory;
    //deafaultResponseFormats: IFormatConverterFactory[];
    //dataMapper: IDataMapper; 
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