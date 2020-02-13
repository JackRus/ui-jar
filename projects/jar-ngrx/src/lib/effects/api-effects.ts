import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { ApiActionTypes, MakeRequest, RequestSuccess, RequestError, MakeCancellableRequest, CancellableRequestSuccess, CancellableRequestError } from '../actions/api-actions';
import { of } from 'rxjs';
import { mergeMap, map, catchError, switchMap, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpDataService } from '../http/http-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { JsonFormatConverter } from '../converters/json-converter';
import { HttpMethodsEnum } from '../http/http-models';
import { DataRequest } from '../http/data-request';
import { AppActions, UpsertOne, UpsertMany, AddMany, AddOne, ReplaceAll, RemoveMany } from '../actions/app-state-actions';

@Injectable()
export class ApiEffects {
    constructor(private actions$: Actions, private httpService: HttpDataService){}
    
    @Effect()
    makeRequest$ = createEffect(() => this.actions$.pipe(       
        ofType<MakeRequest>(ApiActionTypes.MakeRequest),
        mergeMap(action => this.httpService.executeRequest(action.payload).pipe(
            map(response => new RequestSuccess(action.payload, response)),
            catchError(err => of(new RequestError(this.getErrors(err), action.payload.modelStateName)))
        ))
    ));

    @Effect()
    makeCancellableRequest$ = createEffect(() => this.actions$.pipe(       
        ofType<MakeCancellableRequest>(ApiActionTypes.MakeRequest),
        mergeMap(action => this.httpService.executeRequest(action.payload).pipe(
            map(response => new CancellableRequestSuccess(action.payload, response)),
            catchError(err => of(new CancellableRequestError(this.getErrors(err), action.payload.modelStateName)))
        ))
    ));

    @Effect()
    requestSuccess$ = createEffect(() => this.actions$.pipe(       
        ofType<RequestSuccess>(ApiActionTypes.MakeRequest),
        mergeMap(action => {
            const request = action.payload.request;
            const responseData = action.payload.data;
            let actions = [];
            try {    
                // DETERMINE ACTION TYPE AND ADD IT     
                const appAction = this.getAppStateAction(request, responseData)    
                if (appAction) actions.push(appAction);

                // ADD MAPPER ACTIONS
                if (request.mapper) actions.push(request.mapper({
                    data: responseData, 
                    modelStateName: request.modelStateName 
                }));

                // ADD CHAINED REQUEST ACTION
                if (request.chainedRequest) actions.push(new MakeRequest(request.chainedRequest(responseData)));

                // EXECUTE COMPLETER
                if (request.completer) request.completer(responseData);
            }
            catch {
                return [new RequestError(['Could not execute mapper. Chained request, if any, was cancelled.'], request.modelStateName)]
            }  
            return actions;         
        })
    ));

    private getErrors(err: any): string [] {
        let errors: string[];
        if (err instanceof HttpErrorResponse) errors = new JsonFormatConverter().convertToObject(err.error);
        else if (typeof err === 'string') errors = [err];
        else {
            errors = ['Unknown error. Please check console logs.'];
            console.error('===> UNKNOWN ERROR DETAILS <===');
            console.error(err);
        }
        return errors;
    }

    private getAppStateAction(request: DataRequest, data: any): AppActions {
        if (!data) return null;

        // CHECK IF IS ARRAY
        const isArray = Array.isArray(data);

        // TODO CHECK WHEN ACTIONS ARE NEEDED AND COMPABILITY WITH Ok() response;
        switch(request.requestType) {
            case HttpMethodsEnum.GET: return isArray ? new ReplaceAll(data, request.modelStateName) : new UpsertOne(data, request.modelStateName);
            case HttpMethodsEnum.POST: return isArray ? new AddMany(data, request.modelStateName) : new AddOne(data, request.modelStateName);
            case HttpMethodsEnum.PATCH: return isArray ? new UpsertMany(data, request.modelStateName) : new AddOne(data, request.modelStateName);
            case HttpMethodsEnum.PUT: return isArray ? new UpsertMany(data, request.modelStateName) : new AddOne(data, request.modelStateName);
            case HttpMethodsEnum.DELETE: return isArray ? new RemoveMany(data.map(x => x.id), request.modelStateName) : new AddOne(data.id, request.modelStateName);
            default: return null;
        }
    }
} 