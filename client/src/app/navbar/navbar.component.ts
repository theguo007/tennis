import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) { 
    this.createForm();
  }


  ngOnInit() {
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.email ],
      password: ['', [ Validators.required ] ]
    });
  }

  onLogin() {
    const user = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    }
    console.log("logging in");

    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success){
        this.authService.storeUserData(data.token, data.user);
        console.log("logged in successfully");
        // todo: add logged in message
        this.router.navigate(['/']);
      } else {
        // todo: add failed message
        console.log('login failed');
        this.router.navigate(['/login']);
      }

    });

    this.loginForm.reset();   
  }

}
