import { ActionBase } from './action-models'

export enum AppActionTypes {
    // APP STATE ACTIONS
    AddModelState = '[APP STATE] Add',
    RemoveModelState = '[APP STATE] Remove',
    ResetAppState = '[APP STATE] Reset App State',

    // SPECIFIC MODEL STATE ACTIONS
    AddOne = '[MODEL STATE] Add One',
    AddMany = '[MODEL STATE] Add Many',
    ReplaceAll = '[MODEL STATE] Replace All',
    RemoveOne = '[MODEL STATE] Remove One',
    RemoveMany = '[MODEL STATE] Remove Many',
    RemoveAll = '[MODEL STATE] Remove All',
    UpdateOne = '[MODEL STATE] Update One',
    UpdateMany = '[MODEL STATE] Update Many',
    UpsertOne = '[MODEL STATE] Upsert One',
    UpsertMany = '[MODEL STATE] Upsert Many',
    SelectOne = '[MODEL STATE] Select One',
}

/////////////////////////////
///// APP STATE ACTIONS /////
/////////////////////////////

export class AddModelState extends ActionBase {
    constructor(modelStateName: string) { super(modelStateName, AppActionTypes.AddModelState) }
}

export class RemoveModelState extends ActionBase {
    constructor(modelStateName: string) { super(modelStateName, AppActionTypes.RemoveModelState) }
}

export class ResetAppState extends ActionBase {
    constructor(modelStateName: string) { super(modelStateName, AppActionTypes.ResetAppState) }
}

////////////////////////////////////////
///// SPECIFIC MODEL STATE ACTIONS /////
////////////////////////////////////////

export class AddOne extends ActionBase {
    constructor(entity: any, modelStateName: string) { super(modelStateName, AppActionTypes.AddOne, entity) }
}

export class AddMany extends ActionBase {  
    constructor(entities: any[], modelStateName: string) { super(modelStateName, AppActionTypes.AddMany, entities) }
}

export class ReplaceAll extends ActionBase {  
    constructor(entities: any[], modelStateName: string) { super(modelStateName, AppActionTypes.ReplaceAll, entities) }
}

export class RemoveOne extends ActionBase {    
    constructor(entity: any, modelStateName: string) { super(modelStateName, AppActionTypes.RemoveOne, entity) }
}

export class RemoveMany extends ActionBase {   
    constructor(entities: any[], modelStateName: string) { super(modelStateName, AppActionTypes.RemoveMany, entities) }
}

export class RemoveAll extends ActionBase {   
    constructor(modelStateName: string) { super(modelStateName, AppActionTypes.RemoveAll) }
}

export class UpdateOne extends ActionBase {   
    constructor(entity: any, modelStateName: string) { super(modelStateName, AppActionTypes.UpdateOne, entity) }
}

export class UpdateMany extends ActionBase {
    constructor(entities: any[], modelStateName: string) { super(modelStateName, AppActionTypes.UpdateMany, entities) }
}

export class UpsertOne extends ActionBase {   
    constructor(entity: any, modelStateName: string) { super(modelStateName, AppActionTypes.UpsertOne, entity) }
}

export class UpsertMany extends ActionBase {
    constructor(entities: any[], modelStateName: string) { super(modelStateName, AppActionTypes.UpsertMany, entities) }
}

export class SelectOne extends ActionBase {
    readonly type: string;
    constructor(id: string | number, modelStateName: string) { super(modelStateName, AppActionTypes.SelectOne, id) }
}

export type AppActions =
// APP LEVEL
AddModelState | RemoveModelState | ResetAppState |
// MODEL STATE LEVEL
AddOne | AddMany |
ReplaceAll | 
RemoveOne | RemoveMany | RemoveAll |
UpdateOne | UpdateMany |
UpsertOne | UpsertMany | 
SelectOne;