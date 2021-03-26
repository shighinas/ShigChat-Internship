import { HttpInterceptor } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class TokenIntercertorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req:any, nxt:any){
    let authservice = this.injector.get(UserService);
    let tokenizedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${authservice.getToken}`}
      })
    return nxt.handle(tokenizedReq);
  }
}
