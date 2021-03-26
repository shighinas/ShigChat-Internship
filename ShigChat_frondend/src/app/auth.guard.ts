import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _auth: UserService, private router: Router){}
  canActivate(): boolean {
    if( this._auth.loggedIn()){
      return true
    }
    else{
      this.router.navigate(['']);
      return false;
    }
  }

}
