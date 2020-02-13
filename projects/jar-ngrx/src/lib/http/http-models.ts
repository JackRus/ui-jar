import { AppActions } from '../actions/app-state-actions';

/** Supported Http Methods */
export enum HttpMethodsEnum {   
    GET = 'GET',
    DELETE = 'DELETE',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH'
 }

 /** Supported HttpResponse Types */
export enum ResponseDataType
{
    ArrayBuffer = "arraybuffer",
    Blob = "blob",
    Document = "document",
    Json = "json",
    Text = "text",    
}

export enum ResponseAction {
    
}
 
export class KeyValuePair { 
    constructor(public name: string, public value: string) { }
}

export interface MapperBase {
    data: any;
    modelStateName: string;    
}

/**  */
export type IModelMapper = (data: MapperBase) => AppActions[];

/**  */
export type ICompleter = (data: any) => void;