import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { ApiActionTypes, MakeRequest, RequestSuccess, RequestError } from '../actions/api-actions';
import { of } from 'rxjs';
import { mergeMap, map, catchError, switchMap, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpDataService } from '../http/http-data.service';
import { HttpErrorResponse } from '@angular/common/http';

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

    requestSuccess$ = createEffect(() => this.actions$.pipe(       
        ofType<RequestSuccess>(ApiActionTypes.MakeRequest),
        mergeMap(action => {
            const request = action.payload.request;
            try {

            }
            catch(err) {
                return [new RequestError([err], request.modelStateName)]
            }
            finally {

            }
        })
    ));

    private getErrors(err: any): string [] {
        let errors: string[];
        if (err instanceof HttpErrorResponse) errors = new JsonFormatConverter().convertToObject(err.error);
        else if (typeof err === 'string') errors = [err];
        else errors = ['Unknown error'];
        return errors;
    }
} 