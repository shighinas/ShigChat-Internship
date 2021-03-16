import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private snackbar:MatSnackBar) { }

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  }

  regUser(data : object) {
    return this.http.post('http://localhost:2000/user/reg', data);
  }

  success(msg: string){
    this.snackbar.open(msg, '', {
      duration: 40000,
      panelClass: "success-dialog"
    });
  }

  error(msg: string) {
    this.snackbar.open(msg, 'OK', {
      duration: 4000,
      panelClass: "error-dialog"
    })
  }
}
