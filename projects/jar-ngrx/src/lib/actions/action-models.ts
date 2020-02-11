import { Action } from '@ngrx/store';

export class ActionBase<T = any> implements Action {
    readonly type: string;
    readonly baseType: string;
    readonly modelStateName: string;
    public payload: T;
    constructor(modelStateName: string, actionType: string, payload: T = null) {
        this.baseType = actionType;
        this.modelStateName = modelStateName;
        this.type = `${actionType}: ${modelStateName}`;
        this.payload = payload;
    }
}