import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { Observable }       from 'rxjs/Observable';
import { map, catchError }  from 'rxjs/operators';
import { environment }      from '../environment';

import ResponseHandlerUtil from '../utils/services/responseHandler.util';

@Injectable()
export class LoginService {
  private loggingEnabled: boolean = false;

  private responseHandlerUtil: ResponseHandlerUtil;

  constructor(private http: HttpClient){
    this.responseHandlerUtil = new ResponseHandlerUtil();
  }

  login(userId: String, pwd: String) : Observable<HttpResponseBase>{
    // TODO - Add logging util
    if( this.loggingEnabled ) console.log( "loginService::login" );

    const url = `${environment.anapneoService}/login`;
    const body = { userId, pwd };

    return this.http.post( url, body ).pipe(
      map((response: HttpResponseBase) => {
        console.log('Successful login');
        return response
      }),
      catchError((error: HttpErrorResponse ) => this.responseHandlerUtil.handleError(error)));
  }
}
