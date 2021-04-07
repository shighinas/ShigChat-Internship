import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide : boolean = true;
  constructor(private fb: FormBuilder, private userservice: UserService, private router:Router, private msgserv:MessageService) { }

  ngOnInit(): void {
  }

  userData= this.fb.group({
    username : new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required])
  });


  login() {
    console.log(this.userData.value);
    this.userservice.login(this.userData.value)
    .subscribe( (res: any)=>{
      console.log(res);
      sessionStorage.setItem("user", this.userData.value.username);
      sessionStorage.setItem("userid", res.userid);
      this.msgserv.addUser(sessionStorage.getItem('user'));
      this.router.navigate(["chat"]);
    }, (err)=>{
      console.log(err);
      this.userservice.error(err.error);
      this.userData.reset();
    });
  }

}
