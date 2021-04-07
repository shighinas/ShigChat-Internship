import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private snackbar:MatSnackBar) { }

  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  }

  regUser(data : object) {
    return this.http.post('http://localhost:2000/user/reg', data);
  }

  login(data : object) {
    return this.http.post('http://localhost:2000/user/login', data);
  }

  allusers() {
    return this.http.get('http://localhost:2000/user/allusers');
  }

  addcontact(id: any, user: any) {
    return this.http.post('http://localhost:2000/user/addcontact/'+id, {'user':user});
  }

  allfriends(id:any) {
    return this.http.get('http://localhost:2000/user/allfriends/'+id);
  }

  uploadImage(formData:any){
    return this.http.post<any>('http://localhost:2000/file', formData);
  }

  blockUser(sender:string, receiver:any, value:boolean){
    return this.http.post('http://localhost:2000/user/blockUser/'+sender, {'receiver': receiver, 'value':value});
  }

  muteUser(sender:string, receiver:any, value:boolean){
    return this.http.post('http://localhost:2000/user/muteUser/'+sender, {'receiver': receiver, 'value':value});
  }

  success(msg: string){
    this.snackbar.open(msg, '', {
      duration: 40000,
      panelClass: "success-dialog"
    });
  }

  error(msg: string) {
    this.snackbar.open(msg, 'OK',this.config)
  }

  loggedIn(){
    return !!sessionStorage.getItem('user');
  }

  getToken(){
    return localStorage.getItem('token');
  }
}
