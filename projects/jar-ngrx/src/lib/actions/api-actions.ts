import { ActionBase } from './action-models';
import { createAction, props } from '@ngrx/store';

export enum ApiActionTypes {
    
    MakeRequest = '[API] Make Request',    
    RequestError = '[API] Request Error',
    RequestSuccess = '[API] Request Success',

    MakeCancellableRequest = '[API] Make Cancellable Request',
    CancellableRequestSuccess = '[API] Cancellable Request Success',
    CancellableRequestError = '[API] Cancellable Request Error',

    SuccessMapping = '[API] Success Mapping', // CHECK IF NEEDED
    EndRequest = '[API] End Request', 
}

export class MakeRequest extends ActionBase<string> {
    constructor(requestId: string, modelStateName: string) { super(modelStateName, ApiActionTypes.MakeRequest, requestId) }
}

export class RequestSuccess extends ActionBase<{ id: string; data: any }> {   
    constructor(requestId: string, public data: any, modelStateName: string) { 
        super(modelStateName, ApiActionTypes.RequestSuccess, ({ id: requestId, data: data }));
    }
}

export class RequestError extends ActionBase<string[]> {   
    constructor(errors: string[], modelStateName: string) { super(modelStateName, ApiActionTypes.RequestError, errors) }
}

export class MakeCancellableRequest extends ActionBase<string> {
    constructor(id: string, modelStateName: string) { super(modelStateName, ApiActionTypes.MakeCancellableRequest, id) }
}

export class CancellableRequestSuccess extends ActionBase<{ id: string; data: any }> {   
    constructor(id: string, public data: any, modelStateName: string) { 
        super(modelStateName, ApiActionTypes.CancellableRequestSuccess, ({ id: id, data: data }));
    }
}

export class CancellableRequestError extends ActionBase<string[]> {   
    constructor(errors: string[], modelStateName: string) { super(modelStateName, ApiActionTypes.CancellableRequestError, errors) }
}

export class SuccessMapping extends ActionBase {   
    constructor(modelStateName: string) { super(modelStateName, ApiActionTypes.SuccessMapping) }
}

export class EndRequest extends ActionBase {   
    constructor(modelStateName: string) { super(modelStateName, ApiActionTypes.EndRequest) }
}

export type ApiActions = 
MakeRequest |
MakeCancellableRequest | 
RequestSuccess |
RequestError |
SuccessMapping |
EndRequest;