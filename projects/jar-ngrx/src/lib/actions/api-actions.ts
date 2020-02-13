import { ActionBase } from './action-models';
import { DataRequest } from '../http/data-request';

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

export class MakeRequest extends ActionBase<DataRequest> {
    constructor(request: DataRequest) { super(request.modelStateName, ApiActionTypes.MakeRequest, request) }
}

export class RequestSuccess extends ActionBase<{ request: DataRequest; data: any }> {   
    constructor(request: DataRequest, public data: any) { 
        super(request.modelStateName, ApiActionTypes.RequestSuccess, ({ request: request, data: data }));
    }
}

export class RequestError extends ActionBase<string[]> {   
    constructor(errors: string[], modelStateName: string) { super(modelStateName, ApiActionTypes.RequestError, errors) }
}

export class MakeCancellableRequest extends ActionBase<DataRequest> {
    constructor(request: DataRequest) { super(request.modelStateName, ApiActionTypes.MakeCancellableRequest, request) }
}

export class CancellableRequestSuccess extends  ActionBase<{ request: DataRequest; data: any }> {   
    constructor(request: DataRequest, public data: any) { 
        super(request.modelStateName, ApiActionTypes.CancellableRequestSuccess, ({ request: request, data: data }));
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