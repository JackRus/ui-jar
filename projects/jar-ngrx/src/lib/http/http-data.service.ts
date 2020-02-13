import { Injectable, Inject } from '@angular/core';
import { DataRequest } from './data-request';
import { HttpClient } from '@angular/common/http';
import { HttpMethodsEnum } from './http-methods';
import { Observable, of } from 'rxjs';
import { JarNgrxConfig } from '../store/state-models';

@Injectable({ providedIn: 'root' })
export class HttpDataService {

    constructor(private http: HttpClient, @Inject('JAR_NGRX_CONFIG') private config: JarNgrxConfig) {}       

    executeRequest(request: DataRequest) : Observable<any>
    {
      switch (request.requestType) {
          case HttpMethodsEnum.GET: return this.getRequest(request);        
          case HttpMethodsEnum.POST: return this.postRequest(request);        
          case HttpMethodsEnum.DELETE: return this.deleteRequest(request);        
          case HttpMethodsEnum.PUT: return this.putRequest(request);        
          case HttpMethodsEnum.PATCH: return this.patchRequest(request);
      }        
    }

    // TODO
    private getRequest(request: DataRequest) { return of({}) }
    private postRequest(request: DataRequest) { return of({}) }
    private deleteRequest(request: DataRequest) { return of({}) }
    private patchRequest(request: DataRequest) { return of({}) }
    private putRequest(request: DataRequest) { return of({}) }    
}