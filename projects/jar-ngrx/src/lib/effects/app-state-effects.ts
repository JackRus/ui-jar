import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { ApiActionTypes, MakeRequest, RequestSuccess } from '../actions/api-actions';
import { of } from 'rxjs';
import { mergeMap, map, catchError, switchMap, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class AppStateEffects {
    constructor(private actions$: Actions){}
   
} 