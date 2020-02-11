import { Action } from '@ngrx/store';

export class ActionBase implements Action {
    readonly type: string;
    readonly baseType: string;
    readonly modelStateName: string;
    public payload: any;
    constructor(modelStateName: string, actionType: string, payload: any = null) {
        this.baseType = actionType;
        this.modelStateName = modelStateName;
        this.type = `${actionType}: ${modelStateName}`;
        this.payload = payload;
    }
}