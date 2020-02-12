
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, NavigationEnd, Event } from '@angular/router';
import { filter, map, tap, startWith, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RouterHelperService {

    private subscription: Observable<any>;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.subscription = this.router.events.pipe(filter(e => e instanceof NavigationEnd));
    }

    /**
       * Returns object, where properties match route parameters names and values     
    */
    getAllRouteParams(): Params {
        let params: Params = {};

        (function extractParams(snapshot: ActivatedRouteSnapshot) {
            Object.assign(params, snapshot.params);
            snapshot.children.forEach(extractParams);
        })(this.route.root.snapshot);

        return params;
    }

    /**
       * Returns value od the provided parameter name, if one is found or returns null
       * @param paramName Parameter Name
    */
    getRouteParam(paramName: string) {
        let result = null;
        if (!paramName) return result;

        (function extractParams(snapshot: ActivatedRouteSnapshot) {
            result = snapshot.params[paramName];
            snapshot.children.forEach(child => extractParams(child));
        })(this.route.root.snapshot);

        return result;
    }

    /**
       * Navigates to the provided route or URL
       * @param route Url address or app route
    */
    goTo(route: string) {
        this.router.navigateByUrl(route);
    }

    /**
       * Observes router for changes, only emits at the end of the navigation. Returns observable of the param value or null.
       * GETS CALLED AFTER THE NAVIGATION END.
       * @param param (Optional) Name of the parameter URL has to have to emit events
    */
    watchParam(param: string = null): Observable<string> {
        return this.subscription.pipe(
            filter(e => e instanceof NavigationEnd),
            startWith(null),
            map(() => this.getRouteParam(param)),
            distinctUntilChanged());
    }

    /**
     * EMITS ON EVERY NAIGATION END EVENT
     */ 
    watchRouter(): Observable<Event> {
        return this.subscription.pipe(startWith(null));
    }

    /**
     * Returns current full URL
     */
    getCurrentRoute() {
        return this.router.url;
    }

    /**
       * Checks if the current url has the path
       * @param path Path/partial url. If param is null returns FALSE
    */
    hasPath(path: string): Observable<boolean> {
        return this.subscription.pipe(map((x) => path ? this.router.url.toLowerCase().includes(path.toLowerCase()) : false));
    }
}