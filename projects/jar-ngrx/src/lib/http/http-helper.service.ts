import { Injectable } from '@angular/core';
import { RequestProvider } from './request-provider';
import { HttpClient } from '@angular/common/http';
import { HttpMethodsEnum } from './http-methods';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpHelperService {

    private requestProviders: { [uid: string]: RequestProvider } = {};

    private _getProvider: (uniqueName: string, baseUrl: string) => RequestProvider;
    private _postProvider: (uniqueName: string, baseUrl: string) => RequestProvider;
    private _deleteProvider: (uniqueName: string, baseUrl: string) => RequestProvider;
    private _putProvider: (uniqueName: string, baseUrl: string) => RequestProvider;
    private _patchProvider: (uniqueName: string, baseUrl: string) => RequestProvider;

    get GET() { return this._getProvider; }
    get POST() { return this._postProvider; }
    get DELETE() { return this._deleteProvider; }
    get PUT() { return this._putProvider; }
    get PATCH() { return this._patchProvider; }

    constructor(private http: HttpClient) {
        this._getProvider = (uniqueName: string, baseUrl: string) => new RequestProvider(uniqueName, baseUrl, HttpMethodsEnum.GET);
        this._postProvider = (uniqueName: string, baseUrl: string) => new RequestProvider(uniqueName, baseUrl, HttpMethodsEnum.POST);
        this._deleteProvider = (uniqueName: string, baseUrl: string) => new RequestProvider(uniqueName, baseUrl, HttpMethodsEnum.DELETE);
        this._putProvider = (uniqueName: string, baseUrl: string) => new RequestProvider(uniqueName, baseUrl, HttpMethodsEnum.PUT);
        this._patchProvider = (uniqueName: string, baseUrl: string) => new RequestProvider(uniqueName, baseUrl, HttpMethodsEnum.PATCH);
    }

    injectRequestProvider(requestId: string, provider: RequestProvider) {
        this.requestProviders[requestId] = provider;
    }

    deleteRequestProvider(requestId: string) {
        this.requestProviders[requestId] = undefined;
    }

    getRequestProvider(requestId: string) {
        return this.requestProviders[requestId];
    }

    makeRequest(provider: RequestProvider) : Observable<any>
    {
        switch (provider.requestType) {
            case HttpMethodsEnum.GET:
              return this.getRequest(http, url, provider.responseFormats);
        
            case HttpMethodsEnum.POST:
              return this.postRequest(http, url, provider.body, provider.requestFormat, provider.responseFormats);
        
            case HttpMethodsEnum.DELETE:
              return this.deleteRequest(http, url, provider.responseFormats);
        
            case HttpMethodsEnum.PUT:
              return this.putRequest(http, url, provider.body, provider.requestFormat, provider.responseFormats);
        
            case HttpMethodsEnum.PATCH:
              return this.patchRequest(http, url, provider.body, provider.requestFormat, provider.responseFormats);
        }
    }

    private getRequest() {}
    private postRequest() {}
    private deleteRequest() {}
    private patchRequest() {}
    private putRequest() {}    
}