import { Observable, combineLatest, Subject, merge } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * an special observable that mantains the data inmutable
 * and you can always reset the data to the orginal value
 */
export class ImmutableObservable<T> extends Observable<T>
{
    private resetObservable$ = new Subject<{ lastValue: boolean, val: T }>();
    private lastValue: T;

    constructor(source: Observable<T>) {
        super((observer) => {
            merge(source.pipe(map(v => { return { lastValue: false, val: v as T } })), this.resetObservable$)
            .subscribe(
                (next) => {
                    if (!next.lastValue) this.lastValue = next.val;
                    let val = next.val;
                    let copy = makeShadowCopy(val);
                    // shallow copy of the value
                    observer.next(copy);
                },
                (error) => observer.error(error),                    
                () => observer.complete()
            );
        });        
    }

    reset(): void { if (this.lastValue) this.resetObservable$.next({ lastValue: true, val: this.lastValue }); }
}

/**
 * OPERATOR - CONVERTS OBSERVABLE INTO IMMUTABLE
 */
export const makeImmutable = () => (source: Observable<any>) => {
    return new ImmutableObservable(source);
};


function makeShadowCopy(value: any): any {
    //make copy of every item if it is array
    if (Array.isArray(value))
        return makeArrayCopy(value as []);

    //make shadow copy of the object
    if (typeof value == 'object') {
        let objVal = value as {};
        return { ...objVal };
    }

    // ALL OTHER TYPE DON"T NEED MODIFICATIONS
    return value;
}

function makeArrayCopy(value: []): any[] {
    let result = [];

    //for each item make a shadow copy
    for (let i = 0; i < value.length; i++)
        result.push(makeShadowCopy(value[i]));

    return result;
}