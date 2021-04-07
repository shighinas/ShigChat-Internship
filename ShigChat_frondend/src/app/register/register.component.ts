import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide : boolean = true;
  constructor(private fb: FormBuilder, private router:Router, private userservice: UserService) { }

  ngOnInit(): void {
  }

  loginData= this.fb.group({
    username : new FormControl('', [Validators.required]),
    Email : new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  registerUser() {
    console.log(this.loginData.value);
    this.userservice.regUser(this.loginData.value)
    .subscribe( (res)=> {
      console.log(res.toString());
      this.userservice.success("Successfully registered. Please Login to Continue...");
      this.router.navigate([""]);
    }, (err)=>{
      console.log(err.error);
      this.userservice.error(err.error);
      this.loginData.reset();
    } );
  }

}
