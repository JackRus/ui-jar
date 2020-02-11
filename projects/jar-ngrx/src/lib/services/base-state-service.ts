import { Store } from '@ngrx/store';
import { AppState } from '../content/state-models';
import { Injectable } from '@angular/core';
import { JarNgrxModule } from '../jar-ngrx.module';
import { Router } from '@angular/router';

export interface ModelServiceBaseOptions {
    watchRouteParam?: string,
    //suppressAutoGet?: boolean
}

export abstract class ModelServiceBase<T> {

    // TOOLS
    private store: Store<any>;
    protected router: Router;

    // 

    constructor(
        private modelStateName: string,
        private endpoint: string,
        private options?: ModelServiceBaseOptions
    ) {
        // DEP INJECTIONS
        this.store = JarNgrxModule.injector.get(Store);
        this.router = JarNgrxModule.injector.get(Router);


        if (options) {
            
        }
    }
}









// test
@Injectable()
export class ServiceS extends ModelServiceBase<any> {

    constructor() {
        super();
    }

}