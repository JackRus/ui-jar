import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, ModelState } from '../store/state-models';
import { JarNgrxModule } from '../jar-ngrx.module';
import { Observable, combineLatest } from 'rxjs';
import { AddModelState, SelectNewId as SelectNewId, RemoveAll, ReplaceAll, AddOne, AddMany, UpsertOne, UpsertMany, UpdateOne, UpdateMany, RemoveOne, RemoveMany } from '../actions/app-state-actions';
import * as adapter from '../store/app-state-modifier'
import { Dictionary } from '@ngrx/entity';
import { map, takeUntil, filter, take, distinctUntilChanged } from 'rxjs/operators';
import { ImmutableObservable } from './immutable-observable';
import { EventEmitter } from '@angular/core';
import { RouterHelperService } from './router-helper.service';
import { HttpDataService } from '../http/http-data.service';
import { HttpMethodsEnum } from '../http/http-models';
import { DataRequest } from '../http/data-request';
import { MakeRequest, MakeCancellableRequest } from '../actions/api-actions';

export interface ModelServiceBaseOptions {
    watchRouteParam?: string,
    //suppressAutoGet?: boolean
}

export abstract class ModelServiceBase<T> {

    // TOOLS
    private store: Store<AppState>;
    protected routerService: RouterHelperService;
    private httpService: HttpDataService;
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
        this.httpService = JarNgrxModule.injector.get(HttpDataService);

        if (options) {
            // TODO 

        }

        this.initiate();
    }

    private initiate() {
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
        this.selectedItem$.subscribe(() => { this.DIRTY_Reset(); });

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
    
    // HTTP METHODS
    get GET() { return new DataRequest(this.modelStateName, this.endpoint, HttpMethodsEnum.GET) }
    get POST() { return new DataRequest(this.modelStateName, this.endpoint, HttpMethodsEnum.POST) }
    get PUT() { return new DataRequest(this.modelStateName, this.endpoint, HttpMethodsEnum.PUT) }
    get PATCH() { return new DataRequest(this.modelStateName, this.endpoint, HttpMethodsEnum.PATCH) }
    get DELETE() { return new DataRequest(this.modelStateName, this.endpoint, HttpMethodsEnum.DELETE) }

    
    /*************************************************************************************/
    /**********************************  EXPOSED API *************************************/
    /*************************************************************************************/

    
    /////////////////
    // DISPATCHERS //
    /////////////////

    dispatch(request: DataRequest) { this.store.dispatch(new MakeRequest(request)) }
    dispatchCancellable(request: DataRequest) { this.store.dispatch(new MakeCancellableRequest(request)) }

    
    ///////////////
    // SELECTORS //
    ///////////////

    SELECT_All(): ImmutableObservable<T[]> { return new ImmutableObservable(this.items$) }
    SELECT_Total(): ImmutableObservable<number> { return new ImmutableObservable(this.total$) }
    SELECT_SelectedItem(): ImmutableObservable<T> { return new ImmutableObservable(this.selectedItem$) }
    SELECT_SelectedId(): ImmutableObservable<string | number> { return new ImmutableObservable(this.selectedId$) }
    SELECT_ById(id: string | number): ImmutableObservable<T> { return new ImmutableObservable(this.itemsDictionary$.pipe(map(items => items[id]))) }
    SELECT_Errors(): ImmutableObservable<string[]> { return new ImmutableObservable(this.errors$) }
    SELECT_IsLoading(): ImmutableObservable<boolean> { return new ImmutableObservable(this.isLoading$) }
    SELECT_isCancellableLoading(): ImmutableObservable<boolean> { return new ImmutableObservable(this.isCancellableLoading$) }

    /////////////////////////
    // MODEL STATE ACTIONS //
    /////////////////////////

    /** Removes all items from Model State */
    STATE_Reset() { this.store.dispatch(new RemoveAll(this.modelStateName)) }

    /** Replaces all items with new collection */
    STATE_ReplaceAll(items: T[]) { this.store.dispatch(new ReplaceAll(items, this.modelStateName)) }

    /** Adds a single item to the state or Updates if item exists */
    STATE_AddOne(item: T) { this.store.dispatch(new UpsertOne(item, this.modelStateName)) }

    /** Adds items to the state or Updates if items exist */
    STATE_AddMany(items: T[]) { this.store.dispatch(new UpsertMany(items, this.modelStateName)) }

    /** Updates a single item in the state if item exists */
    STATE_UpdateOne(item: T) { this.store.dispatch(new UpdateOne(item, this.modelStateName)) }

    /**  Updates items in the state if items exist  */
    STATE_UpdateMany(items: T[]) { this.store.dispatch(new UpdateMany(items, this.modelStateName)) }

    /** Removes a single item from the state */
    STATE_RemoveOne(id: string | number) { this.store.dispatch(new RemoveOne(id, this.modelStateName)) }

    /** Removes items from the state */
    STATE_RemoveMany(ids: string[] | number[]) { this.store.dispatch(new RemoveMany(ids, this.modelStateName)) }
    
    ////////////////////////////////////////////
    // CROSS COMPONENT DIRTY STATE MONITORING //
    ////////////////////////////////////////////

    DIRTY_Watch(source: Observable<boolean>, stopOn: Observable<any>) {
        const id = new Date().getTime();
        source.pipe(takeUntil(stopOn)).subscribe(x => this.dirtyState[id] = x);
    }

    DIRTY_OnSave(f: () => void, stopOn: Observable<any>) { this.$save.pipe(takeUntil(stopOn)).subscribe(f) }
    DIRTY_Save(): void { this.$save.emit() }

    DIRTY_OnReset(f: () => void, stopOn: Observable<any>) {
        this.$reset.pipe(takeUntil(stopOn)).subscribe(f);
    }

    DIRTY_Reset(): void {
        this.$reset.emit();
        const keys = Object.keys(this.dirtyState);
        keys.forEach(k => this.dirtyState[k] = false);
    }

    DIRTY_IsDirty() : boolean {
        const keys = Object.keys(this.dirtyState);
        return keys.some(k => this.dirtyState[k]);
    }
}