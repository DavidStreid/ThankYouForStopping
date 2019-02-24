import { Component } from '@angular/core';

@Component({
  selector: 'anapneo',
  templateUrl: './anapneo.component.html',
  styleUrls: ['./anapneo.component.scss']
})
export class AnapneoComponent {
  public validLogin: boolean;
  isLoggedIn(evt){
    this.validLogin = evt;
  }
}
