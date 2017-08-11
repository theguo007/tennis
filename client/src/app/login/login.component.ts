import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: String;
  password: String;

  constructor(
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

  onLogin() {
    if (this.email && this.password) {
      const user = {
        email: this.email,
        password: this.password
      }

      this.authService.authenticateUser(user).subscribe(data => {
      if(data.success){
        this.authService.storeUserData(data.token, data.user);
        console.log("logged in successfully");
        // todo: add logged in message
        this.router.navigate(['/']);
      } else {
        // todo: add failed message
        console.log('login failed');
        this.router.navigate(['login']);
      }

      });
    }

    
  }

}
