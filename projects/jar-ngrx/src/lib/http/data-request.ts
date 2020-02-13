import { HttpMethodsEnum, IModelMapper, KeyValuePair, ICompleter } from './http-models';

export class DataRequest {
   
    private _route: string = '/'; // the route of the url.
    private _params: KeyValuePair[];  // the params to include in the url.
    private _baseUrl: string;
    private _modelStateName: string;
    private _body: any;      
    private _requestType: HttpMethodsEnum;  
    private _mapper: IModelMapper;  
    private _completer: ICompleter;
    private _chainedRequest: (data: any) => DataRequest;  // create a request after this one is completed
    
    /** get the request type asociated with this provider. */
    get requestType(): HttpMethodsEnum { return this._requestType }

    /** get the request body or null if is not available. */
    get body(): any { return this._body }
    
    /** Get Final Url for Request */
    get fullUrl(): string {        
      
        const apiBase = this._baseUrl.replace(/\/+$/g, '');
        let url = apiBase + '/' + this._route;        

        // BUILD PARAMS URL PART
        if (this._params && this._params.length) {           
            let parsedParams: string[] = [];
            this._params.forEach((v) => parsedParams.push([v.name, v.value].join('=')));
            url += encodeURI(url + '?' + parsedParams.join('&'));             
        }
        
        return url;
    }

    /** get the unique name of the entity */
    get modelStateName() { return this._modelStateName; }

    /** get the request to be executed after or null if there is not any. */
    get chainedRequest() { return this._chainedRequest; }

    /** get the base url of this request */
    get baseUrl() { return this._baseUrl; }

    /**  */
    get mapper() { return this._mapper; }

    /**  */
    get completer() { return this._completer; }

    constructor(modelStateName: string, baseUrl: string, requestType: HttpMethodsEnum) {       
        this._baseUrl = baseUrl;
        this._modelStateName = modelStateName;
        this._requestType = requestType;
    }
   
    /**
     * add a path param to the url.
     * @param pathPart A path part to add to the url.
     */
    at(pathPart: string): DataRequest {
        
        if (!pathPart || !pathPart.trim()) return this;

        // TRIM '/' CHAR IF IT IS FIRST OR LAST
        pathPart = pathPart.replace(/^\/+|\/+$/g, '');
        this._route += `/${pathPart}`;

        return this;
    }

    /**
     * add body to the request (only valid for POST and PUT requests)
     * @param body the body to add
     */
    withBody(body: any): DataRequest {     
        this._body = body;
        return this;
    }

    withBaseUrl(baseUrl: string) {
        this._baseUrl = baseUrl;
        return this;
    }

    /**
     * Callback which will be executed if request is successful. Accespts response data and returns array of Actions.
     * Actions will be dispatched in parallel.
     * @param mapper Callback function
     */
    withMapper(mapper: IModelMapper){
        this._mapper = mapper;
        return this;
    }

    /**
     * Chained request callback which will be executed if request is successful.
     * @param chainedRequest Callback function
     */
    then(chainedRequest: (data: any) => DataRequest) {
        this._chainedRequest = chainedRequest;
        return this;
    }

    /**
     * Custom function which will be executed if request is successful.
     * @param completer Callback function
     */
    completeWith(completer: ICompleter) {
        this._completer = completer;
        return this;
    }
}
