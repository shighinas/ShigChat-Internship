import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide : boolean = false;
  constructor(private fb: FormBuilder, private userservice: UserService) { }

  ngOnInit(): void {
  }

  userData= this.fb.group({
    username : new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required])
  });

  login() {
    console.log(this.userData.value);
  }

}
