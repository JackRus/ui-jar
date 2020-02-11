import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { ApiActionTypes, MakeRequest, RequestSuccess } from '../actions/api-actions';
import { of } from 'rxjs';
import { mergeMap, map, catchError, switchMap, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiEffects {
    constructor(private actions$: Actions){}
    
    @Effect()
    makeRequest$ = createEffect(() => this.actions$.pipe(       
        ofType<MakeRequest>(ApiActionTypes.MakeRequest),
        mergeMap(action => {



            const requestId = action.payload;



            return of(new RequestSuccess('', '', action.modelStateName));
        })
    ));
} 