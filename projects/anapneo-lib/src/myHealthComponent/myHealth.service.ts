import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'
import { map, catchError } from 'rxjs/operators';

import { environment }      from '../environment';
import { UserProfileService }     from '../userProfile/userProfile.service';
import ResponseHandlerUtil        from '../utils/services/responseHandler.util';

@Injectable()
export class MyHealthService {
  // TODO - Make logging util
  private loggingEnabled: boolean = false;
  private responseHandlerUtil: ResponseHandlerUtil;

  constructor(private http: HttpClient, private userProfileService:UserProfileService){
    this.responseHandlerUtil = new ResponseHandlerUtil();
  }

  getHealthProfile(){
    const anapneoService = environment['anapneoService'] || null;
    // TODO - Error handling/backup logic
    if( ! anapneoService ){
      const err = 'Anapneo service url is not defined in config';
      return Observable.create( (observer) => { observer.error(err) } );
    }

    const token = this.userProfileService.getAuthToken();
    const url = `${anapneoService}/health?token=${token}`;

    return this.http.get(url).pipe(
      map( (res: HttpResponseBase) => { return res; },
      catchError( (err: HttpErrorResponse) => this.responseHandlerUtil.handleError(err) ) )
    );
  }
}