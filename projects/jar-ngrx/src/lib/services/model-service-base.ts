import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, ModelState } from '../store/state-models';
import { JarNgrxModule } from '../jar-ngrx.module';
import { Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { AddModelState, SelectNewId as SelectNewId } from '../actions/app-state-actions';
import * as adapter from '../store/app-state-adapter'
import { Dictionary } from '@ngrx/entity';
import { map, takeUntil, filter, take, distinctUntilChanged } from 'rxjs/operators';
import { ImmutableObservable } from '../helpers/immutable-observable';
import { EventEmitter } from '@angular/core';
import { RouterHelperService } from './router-helper';

export interface ModelServiceBaseOptions {
    watchRouteParam?: string,
    //suppressAutoGet?: boolean
}

export abstract class ModelServiceBase<T> {

    // TOOLS
    private store: Store<AppState>;
    protected routerService: RouterHelperService;
    private $reset = new EventEmitter();
    private $save = new EventEmitter();
    private dirtyState = {}; // Container for mitoring dirty state of components

    // ROOUTE PARAM CHANGES
    private routeParam$: Observable<string>;

    // FOUNDATION 
    private modelState$: Observable<ModelState<T>>;
    private items$: Observable<T[]>;
    private itemsDictionary$: Observable<Dictionary<T>>;
    private ids$: Observable<string[] | number[]>;
    private total$: Observable<number>;
    private errors$: Observable<string[]>;
    private selectedId$: Observable<string | number>;
    private isLoading$: Observable<boolean>;
    private isCancellableLoading$: Observable<boolean>;
    private selectedItem$: Observable<T>;

    // PROPS
    protected currentId: string;

    constructor(
        private modelStateName: string,
        private endpoint: string,
        private options?: ModelServiceBaseOptions) 
    {
        // DEP INJECTIONS
        this.store = JarNgrxModule.injector.get(Store) as Store<AppState>;
        this.routerService = JarNgrxModule.injector.get(RouterHelperService);


        if (options) {
            

        }

        this.initiateModelSate();
    }

    private initiateModelSate() {
        this.store.pipe(filter(s => !!s[this.modelStateName]), take(1)).subscribe(() => this.setup());
        this.store.dispatch(new AddModelState(this.modelStateName));
    }

    private setup() {
        this.setupFoundation();
        this.setupSubscribtions();              
    }

    private setupFoundation() {
        // MODEL SATE SELECTOR
        const state = createFeatureSelector<AppState, ModelState<T>>(this.modelStateName);
        
        this.modelState$ = this.store.select(state);
        this.items$ = this.store.select(createSelector(state, adapter.selectAll)); 
        this.itemsDictionary$ = this.store.select(createSelector(state, adapter.selectEntities));
        this.ids$ = this.store.select(createSelector(state, adapter.selectIds));
        this.total$ = this.store.select(createSelector(state, adapter.selectTotal));
        this.errors$ = this.store.select(createSelector(state, adapter.selectErrors));
        this.selectedId$ = this.store.select(createSelector(state, adapter.selectedId));
        this.isLoading$ = this.store.select(createSelector(state, adapter.selectLoading));
        this.isCancellableLoading$ = this.store.select(createSelector(state, adapter.selectCancellableLoading));
        this.selectedItem$ = combineLatest(this.selectedId$, this.itemsDictionary$).pipe(map(([id, items]) => items[id]));  
    }

    private setupSubscribtions() {
        // RESET DIRTY STATE WHEN THE SELECTED ENTITY CHANGED/WAS UPDATED
        this.selectedItem$.subscribe(() => { this.reset(); });

        // MONITOR SELECTED ID CHANGES IN THE ROUTE AND UPDATE ID IN THE STATE
        if (this.options && this.options.watchRouteParam) {
            
            this.routerService.watchParam(this.options.watchRouteParam).subscribe(
                (param) => this.store.dispatch(new SelectNewId(param, this.modelStateName))
            ); 

            this.selectedId$.pipe(distinctUntilChanged()).subscribe(id => {
               this.currentId = String(id);
               // TODO 
               // if (id) get by id  
            });
        }            
    }
    
    


    /////////////////////////
    ////// EXPOSED API //////
    /////////////////////////

    // DISPATCHERS
    dispatch() { }

    // SELECTORS
    selectAll(): ImmutableObservable<T[]> { return new ImmutableObservable(this.items$); }
    selectTotal(): ImmutableObservable<number> { return new ImmutableObservable(this.total$); }
    selectSelectedItem(): ImmutableObservable<T> { return new ImmutableObservable(this.selectedItem$); }

   
    // CROSS COMPONENT DIRTY STATE MONITORING
    watch(source: Observable<boolean>, stopOn: Observable<any>) {
        const id = new Date().getTime();
        source.pipe(takeUntil(stopOn)).subscribe(x => this.dirtyState[id] = x);
    }

    onSave(f: () => void, stopOn: Observable<any>) {
        this.$save.pipe(takeUntil(stopOn)).subscribe(f);
    }

    save(): void { this.$save.emit() }

    onReset(f: () => void, stopOn: Observable<any>) {
        this.$reset.pipe(takeUntil(stopOn)).subscribe(f);
    }

    reset(): void {
        this.$reset.emit();
        const keys = Object.keys(this.dirtyState);
        keys.forEach(k => this.dirtyState[k] = false);
    }

    isDirty() : boolean {
        const keys = Object.keys(this.dirtyState);
        return keys.some(k => this.dirtyState[k]);
    }
}