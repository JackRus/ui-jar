import { Action } from '@ngrx/store';

export interface AppAction extends Action {
    readonly baseType: string;
}
export class ActionBase implements AppAction {
    readonly type: string;
    readonly baseType: ActionTypes;
    constructor(modelStateName: string, actionType: ActionTypes) {
        this.baseType = actionType;
        this.type = `${ActionTypes.AddModelState}: ${modelStateName}`;
    }
}

export enum ActionTypes {
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
    constructor(modelStateName: string) { super(modelStateName, ActionTypes.AddModelState) }
}

export class RemoveModelState extends ActionBase {
    constructor(modelStateName: string) { super(modelStateName, ActionTypes.RemoveModelState) }
}

export class ResetAppState extends ActionBase {
    constructor(modelStateName: string) { super(modelStateName, ActionTypes.ResetAppState) }
}

////////////////////////////////////////
///// SPECIFIC MODEL STATE ACTIONS /////
////////////////////////////////////////

export class AddEntityToState extends ActionBase {
    constructor(public entity: any, public uniqueName: string) {
        this.type = `${ActionTypes.AddEntityToState}: ${uniqueName}`
    }
}


export class AddMany extends ActionBase {
    readonly type: string;
    constructor(public entities: any[], public uniqueName: string) { this.type = `${ActionTypes.AddMany}: ${uniqueName}` }
}


export class DeleteEntityFromState extends ActionBase {
    readonly type: string;
    constructor(public id: string, public uniqueName: string) { this.type = `${ActionTypes.DeleteEntityFromState}: ${uniqueName}` }
}


export class DeleteAll extends ActionBase {
    readonly type: string;
    constructor(public uniqueName: string) { this.type = `${ActionTypes.DeleteAll}: ${uniqueName}` }
}


export class DeleteMany extends ActionBase {
    readonly type: string;
    constructor(public ids: string[], public uniqueName: string) { this.type = `${ActionTypes.DeleteMany}: ${uniqueName}` }
}


export class Update extends ActionBase {
    readonly type: string;
    constructor(public entity: any, public uniqueName: string) { this.type = `${ActionTypes.Update}: ${uniqueName}` }
}


export class UpdateMany extends ActionBase {
    readonly type: string;
    constructor(public entities: any[], public uniqueName: string) { this.type = `${ActionTypes.UpdateMany}: ${uniqueName}` }
}

export class SelectEntity extends ActionBase {
    readonly type: string;
    constructor(public id: string | number, public uniqueName: string) { this.type = `${ActionTypes.SelectEntity}: ${uniqueName}` }
}

export type AppActions =

    CreateEntityState |
    DeleteEntityState |
    DeleteAllEntityStates |

    //actions that affect only specific entity
    AddEntityToState |
    AddMany |
    DeleteEntityFromState |
    DeleteAll |
    DeleteMany |
    Update |
    UpdateMany |
    SelectEntity
    ;