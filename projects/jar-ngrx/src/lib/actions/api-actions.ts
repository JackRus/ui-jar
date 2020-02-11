import { ActionBase } from './action-models';

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

export class MakeRequest extends ActionBase {
    constructor(id: string, modelStateName: string) { super(modelStateName, ApiActionTypes.MakeRequest, id) }
}

export class RequestSuccess extends ActionBase {   
    constructor(id: string, public data: any, modelStateName: string) { 
        super(modelStateName, ApiActionTypes.RequestSuccess, ({ id: id, data: data }));
    }
}

export class RequestError extends ActionBase {   
    constructor(errors: string[], modelStateName: string) { super(modelStateName, ApiActionTypes.RequestError, errors) }
}

export class MakeCancellableRequest extends ActionBase {
    constructor(id: string, modelStateName: string) { super(modelStateName, ApiActionTypes.MakeCancellableRequest, id) }
}

export class CancellableRequestSuccess extends ActionBase {   
    constructor(id: string, public data: any, modelStateName: string) { 
        super(modelStateName, ApiActionTypes.CancellableRequestSuccess, ({ id: id, data: data }));
    }
}

export class CancellableRequestError extends ActionBase {   
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