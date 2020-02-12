import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, ModelState } from '../content/state-models';
import { JarNgrxModule } from '../jar-ngrx.module';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AddModelState } from '../actions/app-state-actions';
import { selectAll, selectEntities, selectTotal, selectLoading, selectedId, selectCancellableLoading, selectErrors, selectIds } from '../content/app-state-adapter'

export interface ModelServiceBaseOptions {
    watchRouteParam?: string,
    //suppressAutoGet?: boolean
}

export abstract class ModelServiceBase<T> {

    // TOOLS
    private store: Store<AppState>;
    protected router: Router;

    // ROOUTE PARAM CHANGES
    routeParam$: Observable<string>;

    // FOUNDATION 
    private modelState$: Observable<ModelState<T>>;
    private items$: Observable<T[]>;
    private ids$: Observable<string[] | number[]>;
    private total$: Observable<number>;
    private errors$: Observable<string[]>;
    private selectedId$: Observable<string | number>;
    private isLoading$: Observable<boolean>;
    private isCancellableLoading$: Observable<boolean>;
    private selectecEntity$: Observable<T>;


    constructor(
        private modelStateName: string,
        private endpoint: string,
        private options?: ModelServiceBaseOptions) 
    {
        // DEP INJECTIONS
        this.store = JarNgrxModule.injector.get(Store) as Store<AppState>;
        this.router = JarNgrxModule.injector.get(Router);


        if (options) {
            

        }

        this.setup();
    }

    setup(){
        this.store.dispatch(new AddModelState(this.modelStateName));
    }

    setupFoundation() {
        // MODEL SATE SELECTOR
        const state = createFeatureSelector<AppState, ModelState<T>>(this.modelStateName);
        
        this.modelState$ = this.store.select(state);
        this.items$ = this.store.select(createSelector(state, selectAll)); 
        this.ids$ = this.store.select(createSelector(state, selectIds));
        this.total$ = this.store.select(createSelector(state, selectTotal));
        this.errors$ = this.store.select(createSelector(state, selectErrors));
        this.selectedId$ = this.store.select(createSelector(state, selectedId));
        this.isLoading$ = this.store.select(createSelector(state, selectLoading));
        this.isCancellableLoading$ = this.store.select(createSelector(state, selectCancellableLoading));
        this.selectecEntity$ = 

    }
}