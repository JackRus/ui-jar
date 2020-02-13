import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { ApiActionTypes, MakeRequest, RequestSuccess, RequestError, MakeCancellableRequest, CancellableRequestSuccess, CancellableRequestError } from '../actions/api-actions';
import { of } from 'rxjs';
import { mergeMap, map, catchError, switchMap, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpDataService } from '../http/http-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { JsonFormatConverter } from '../converters/json-converter';

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
            let actions = [];
            try {
                if (request.mapper) actions.push(request.mapper({
                    data: action.payload.data, 
                    modelStateName: request.modelStateName 
                }));
                if (request.chainedRequest) actions.push(new MakeRequest(request.chainedRequest(action.payload.data)));
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
} 