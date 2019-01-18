import { Component, Output, EventEmitter }  from '@angular/core';
import { FormGroup, FormControl }           from '@angular/forms';

import { UserProfileService }   from '../userProfile/userProfile.service';
import { LoginService }         from '../services/login.service';
import EncryptUtil              from '../utils/encrypt.util';
import LoggerUtil               from '../utils/logger.util';

@Component({
  selector: 'user-login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.scss' ]
})

export class LoginComponent {
  // TODO - Add logger (make seperate class/util)
  private encryptUtil;
  private logger: any;

  @Output() isLoggedIn: EventEmitter<any> = new EventEmitter();

  constructor(private userProfileService: UserProfileService, private loginService:LoginService){
    this.encryptUtil = new EncryptUtil();
    this.logger = new LoggerUtil();
  }

  loginForm = new FormGroup({
    user: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    let user = this.loginForm.value.user;
    let password = this.loginForm.value.password;
    this.login(user, password);
  }

  login(user: String, password: String){
    this.logger.debug( `User: ${user}, Password: ${password}` );

    const encodedUser = this.encryptUtil.encrypt(user);
    const encodedPassword = this.encryptUtil.encrypt(password);

    this.loginService.login(encodedUser, encodedPassword).subscribe({
      next: ( loginStatus: Object ) => {
        if( loginStatus[ 'success' ] ){
          const token = loginStatus['token'];
          if( token ){
            this.userProfileService.setAuthToken(token);
            this.logger.debug( `Login Successful with token ${token}` );
            this.isLoggedIn.emit(true);
          }
          else {
            this.handleLoginFailure('Login Unsuccessful: login token is null');
          }
        } else {
          const error = loginStatus[ 'status' ] || 'ERROR';
          this.handleLoginFailure(`Login Unsuccessful: ${error}`);
        }
      },
      error: (e) => console.error('User Login Failed: ' + e)
    });
  }

  handleLoginFailure(msg) {
    this.logger.log( msg );
    // TODO - add a modal that will prompt the user to login again and give the reason why
  }

  // TODO -
  // Disabeled/Validation Logic
  // [disabled]="!loginForm.valid"
  // type="submit"
}
