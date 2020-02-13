import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppActionTypes, AddOne } from '../actions/app-state-actions';

@Injectable()
export class AppStateEffects {
    constructor(private actions$: Actions){}
   
    // BY DEFAULT APP STATE ACTIONS DONT HAVE SIDE EFFECTS
    // ADD WHEN EVER THERE IS A NEED FOR ONE

    ////////////////
    /// TEMPLATE ///
    ////////////////

    // @Effect()
    // addOne$ = createEffect(() => this.actions$.pipe(       
    //     ofType<AddOne>(AppActionTypes.AddOne),
    //     mergeMap(action => {

    //         // DO SOMETHING 

    //         // RETURNS EMPTY ACTION
    //         return EMPTY;
    //     })
    // ));
} 